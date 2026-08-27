-- 033_align_live_student_contract.sql
-- Align the live legacy students table with the application model used by the
-- admin and portal clients. The legacy table requires name/class/program/
-- campus/parent fields, while newer code uses full_name and auth_user_id.

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS full_name TEXT;

UPDATE public.students
SET full_name = COALESCE(NULLIF(trim(full_name), ''), name)
WHERE full_name IS NULL OR trim(full_name) = '';

ALTER TABLE public.students
  ALTER COLUMN full_name SET NOT NULL;

CREATE OR REPLACE FUNCTION public.sync_student_name_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.full_name := COALESCE(NULLIF(trim(NEW.full_name), ''), NEW.name);
  NEW.name := COALESCE(NULLIF(trim(NEW.name), ''), NEW.full_name);
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_student_name_fields() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_student_name_fields() TO postgres, service_role;

DROP TRIGGER IF EXISTS sync_student_name_fields ON public.students;
CREATE TRIGGER sync_student_name_fields
  BEFORE INSERT OR UPDATE OF name, full_name
  ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_student_name_fields();

DROP FUNCTION IF EXISTS public.approve_and_create_account(UUID, UUID, UUID);

CREATE OR REPLACE FUNCTION public.approve_and_create_account(
  app_id UUID,
  reviewer_id UUID,
  student_auth_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  app RECORD;
  new_student_id UUID;
  new_student_number TEXT;
  resolved_class_level INTEGER;
  resolved_program TEXT;
  resolved_campus TEXT;
BEGIN
  IF reviewer_id IS NULL OR student_auth_user_id IS NULL THEN
    RAISE EXCEPTION 'Reviewer and Auth user are required';
  END IF;

  SELECT * INTO app
  FROM public.applications
  WHERE id = app_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found';
  END IF;

  IF app.status NOT IN ('pending', 'under_review', 'reviewing') THEN
    RAISE EXCEPTION 'Cannot approve application with status: %', app.status;
  END IF;

  IF app.email IS NULL OR trim(app.email) = '' THEN
    RAISE EXCEPTION 'Application email is required';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.students
    WHERE email IS NOT NULL AND lower(email) = lower(trim(app.email))
  ) THEN
    RAISE EXCEPTION 'Student with email already exists';
  END IF;

  IF app.identity_number IS NOT NULL AND trim(app.identity_number) <> ''
     AND EXISTS (
       SELECT 1 FROM public.students
       WHERE identity_number = app.identity_number
     ) THEN
    RAISE EXCEPTION 'Student with identity number already exists';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.students
    WHERE auth_user_id = student_auth_user_id
  ) THEN
    RAISE EXCEPTION 'Auth user is already linked to a student';
  END IF;

  resolved_class_level := COALESCE(
    app.class_level,
    CASE app.grade
      WHEN '10th' THEN 10
      WHEN '11th' THEN 11
      WHEN '12th' THEN 12
      ELSE 9
    END
  );
  resolved_program := COALESCE(NULLIF(trim(app.program), ''), 'matric');
  resolved_campus := COALESCE(NULLIF(trim(app.campus), ''), 'main');
  new_student_number := 'STU-' || EXTRACT(YEAR FROM NOW()) || '-' ||
    LPAD(nextval('public.student_number_seq')::TEXT, 4, '0');

  INSERT INTO public.students (
    student_number,
    auth_user_id,
    name,
    full_name,
    father_name,
    phone,
    identity_type,
    identity_number,
    gender,
    grade,
    class_level,
    program,
    campus,
    address,
    admission_date,
    monthly_fee,
    status,
    email,
    parent_name,
    parent_phone,
    parent_cnic
  )
  VALUES (
    new_student_number,
    student_auth_user_id,
    app.full_name,
    app.full_name,
    COALESCE(app.father_name, ''),
    app.phone,
    COALESCE(app.identity_type, 'b_form'),
    app.identity_number,
    COALESCE(app.gender, 'male'),
    COALESCE(app.grade, '9th'),
    resolved_class_level,
    resolved_program,
    resolved_campus,
    COALESCE(app.address, ''),
    CURRENT_DATE,
    0,
    'active',
    lower(trim(app.email)),
    COALESCE(app.parent_name, app.father_name, ''),
    COALESCE(app.parent_phone, app.phone, ''),
    app.parent_cnic
  )
  RETURNING id INTO new_student_id;

  UPDATE public.applications
  SET status = 'approved',
      student_id = new_student_id,
      reviewed_by = reviewer_id,
      reviewed_at = now(),
      updated_at = now()
  WHERE id = app_id;

  INSERT INTO public.application_status_history
    (application_id, old_status, new_status, changed_by, reason)
  VALUES
    (app_id, app.status, 'approved', reviewer_id, 'Approved and student admitted');

  RETURN jsonb_build_object(
    'student_id', new_student_id,
    'student_number', new_student_number,
    'application_number', app.application_number
  );
END;
$$;

REVOKE ALL ON FUNCTION public.approve_and_create_account(UUID, UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_and_create_account(UUID, UUID, UUID)
  TO service_role;
