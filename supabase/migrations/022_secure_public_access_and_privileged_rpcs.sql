-- Phase 2: secure public access and privileged operations
-- Apply only after review in a disposable Supabase project.
-- This migration is intentionally not applied by the agent.

-- Replace the legacy function before dropping columns it referenced.
DROP FUNCTION IF EXISTS public.approve_and_create_account(UUID, UUID);

-- Legacy raw credentials must not remain in academy tables.
ALTER TABLE public.applications DROP COLUMN IF EXISTS password;
ALTER TABLE public.students DROP COLUMN IF EXISTS password;

CREATE OR REPLACE FUNCTION public.approve_and_create_account(
  app_id UUID,
  reviewer_id UUID
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

  IF app.email IS NOT NULL AND app.email <> ''
     AND EXISTS (SELECT 1 FROM public.students WHERE email = app.email) THEN
    RAISE EXCEPTION 'Student with email already exists';
  END IF;

  IF app.identity_number IS NOT NULL AND app.identity_number <> ''
     AND EXISTS (SELECT 1 FROM public.students WHERE identity_number = app.identity_number) THEN
    RAISE EXCEPTION 'Student with identity number already exists';
  END IF;

  new_student_number := 'STU-' || EXTRACT(YEAR FROM NOW()) || '-' ||
    LPAD(nextval('public.student_number_seq')::TEXT, 4, '0');

  INSERT INTO public.students (
    student_number, full_name, father_name, phone, identity_type,
    identity_number, gender, grade, address, admission_date,
    monthly_fee, status, email
  )
  VALUES (
    new_student_number, app.full_name, COALESCE(app.father_name, ''), app.phone,
    'b_form', app.identity_number, COALESCE(app.gender, 'male'),
    COALESCE(app.grade, '9th'), COALESCE(app.address, ''),
    CURRENT_DATE, 0, 'active', app.email
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

-- Public callers may submit an application, but must not read application rows.
DROP POLICY IF EXISTS "Public can read own applications" ON public.applications;
DROP POLICY IF EXISTS "Public can read applications" ON public.applications;
REVOKE ALL ON TABLE public.applications FROM anon, authenticated;
GRANT INSERT ON TABLE public.applications TO anon;
GRANT SELECT ON TABLE public.applications TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.application_number_seq TO anon;

-- Return only the minimum status fields required by the public tracking page.
-- The caller must provide both the human-readable application number and the
-- email submitted with the application. The tracking page must not query the
-- table directly or return the full application row.
CREATE OR REPLACE FUNCTION public.track_application(
  p_application_number TEXT,
  p_email TEXT
)
RETURNS TABLE (
  application_number TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    a.application_number,
    a.status,
    a.created_at,
    a.reviewed_at
  FROM public.applications AS a
  WHERE a.application_number = trim(p_application_number)
    AND lower(a.email) = lower(trim(p_email))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.track_application(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_application(TEXT, TEXT) TO anon, authenticated;

-- These functions perform cross-table privileged work. They must not be
-- callable by browser roles until a server-side admin boundary is in place.
REVOKE ALL ON FUNCTION public.approve_application(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.approve_and_create_account(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.generate_monthly_fees(TEXT, NUMERIC) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_application(UUID, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.approve_and_create_account(UUID, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_monthly_fees(TEXT, NUMERIC) TO service_role;
