-- Phase 3: Supabase Auth account provisioning
-- Apply only after migration 022 has been tested in a disposable project.
-- The service-only endpoint supplies the authenticated reviewer ID and the
-- invited Auth user ID; browser roles cannot execute this function.

DROP FUNCTION IF EXISTS public.approve_and_create_account(UUID, UUID);

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

  new_student_number := 'STU-' || EXTRACT(YEAR FROM NOW()) || '-' ||
    LPAD(nextval('public.student_number_seq')::TEXT, 4, '0');

  INSERT INTO public.students (
    student_number, auth_user_id, full_name, father_name, phone, identity_type,
    identity_number, gender, grade, address, admission_date,
    monthly_fee, status, email
  )
  VALUES (
    new_student_number, student_auth_user_id, app.full_name,
    COALESCE(app.father_name, ''), app.phone, 'b_form',
    app.identity_number, COALESCE(app.gender, 'male'),
    COALESCE(app.grade, '9th'), COALESCE(app.address, ''),
    CURRENT_DATE, 0, 'active', lower(trim(app.email))
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
