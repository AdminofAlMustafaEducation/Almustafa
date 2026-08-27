-- 028_admission_code_tracking.sql
-- Public tracking intentionally accepts only the admission code and returns
-- status metadata, never applicant identity, contact data, or reviewer notes.
-- Apply after migrations 022-027 in a disposable environment first.

DROP FUNCTION IF EXISTS public.track_application(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.track_application(TEXT, TEXT);

DROP FUNCTION IF EXISTS public.submit_application(JSONB);
ALTER TABLE public.applications
  DROP COLUMN IF EXISTS tracking_token_hash,
  DROP COLUMN IF EXISTS tracking_token_issued_at;

CREATE OR REPLACE FUNCTION public.submit_application(p_application JSONB)
RETURNS TABLE (application_number TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_application_number TEXT;
BEGIN
  INSERT INTO public.applications (
    full_name,
    email,
    phone,
    id_number,
    gender,
    grade,
    father_name,
    date_of_birth,
    address,
    previous_school,
    guardian_occupation,
    message,
    parent_name,
    parent_phone,
    parent_cnic,
    class_level,
    program,
    campus
  )
  VALUES (
    trim(COALESCE(p_application ->> 'full_name', '')),
    lower(trim(COALESCE(p_application ->> 'email', ''))),
    trim(COALESCE(p_application ->> 'phone', '')),
    trim(COALESCE(p_application ->> 'id_number', '')),
    COALESCE(NULLIF(p_application ->> 'gender', ''), 'male'),
    COALESCE(NULLIF(p_application ->> 'grade', ''), '9th'),
    NULLIF(trim(COALESCE(p_application ->> 'father_name', '')), ''),
    NULLIF(trim(COALESCE(p_application ->> 'date_of_birth', '')), ''),
    NULLIF(trim(COALESCE(p_application ->> 'address', '')), ''),
    NULLIF(trim(COALESCE(p_application ->> 'previous_school', '')), ''),
    NULLIF(trim(COALESCE(p_application ->> 'guardian_occupation', '')), ''),
    NULLIF(trim(COALESCE(p_application ->> 'message', '')), ''),
    NULLIF(trim(COALESCE(p_application ->> 'parent_name', '')), ''),
    NULLIF(trim(COALESCE(p_application ->> 'parent_phone', '')), ''),
    NULLIF(trim(COALESCE(p_application ->> 'parent_cnic', '')), ''),
    COALESCE(NULLIF(p_application ->> 'class_level', '')::INT, 9),
    COALESCE(NULLIF(p_application ->> 'program', ''), 'matric'),
    COALESCE(NULLIF(p_application ->> 'campus', ''), 'main')
  )
  RETURNING public.applications.application_number INTO v_application_number;

  RETURN QUERY SELECT v_application_number;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_application(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_application(JSONB) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.track_application(p_application_number TEXT)
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
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.track_application(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_application(TEXT) TO anon, authenticated;
