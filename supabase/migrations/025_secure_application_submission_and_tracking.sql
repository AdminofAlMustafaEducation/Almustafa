-- Phase 3: secure application submission and tracking tokens
-- Apply only after migrations 022-024 pass in a disposable Supabase project.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS tracking_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS tracking_token_issued_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS applications_tracking_token_hash_key
  ON public.applications (tracking_token_hash)
  WHERE tracking_token_hash IS NOT NULL;

-- Direct anonymous inserts would bypass token generation, so submission moves to
-- an allow-listed SECURITY DEFINER function with no caller-controlled status or
-- reviewer fields.
REVOKE INSERT, SELECT, UPDATE, DELETE ON TABLE public.applications FROM anon;

CREATE OR REPLACE FUNCTION public.submit_application(p_application JSONB)
RETURNS TABLE (application_number TEXT, tracking_token TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_application_number TEXT;
  v_tracking_token TEXT := encode(pg_catalog.gen_random_bytes(32), 'hex');
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
    campus,
    tracking_token_hash,
    tracking_token_issued_at
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
    COALESCE(NULLIF(p_application ->> 'campus', ''), 'main'),
    encode(pg_catalog.digest(v_tracking_token, 'sha256'), 'hex'),
    now()
  )
  RETURNING public.applications.application_number INTO v_application_number;

  RETURN QUERY SELECT v_application_number, v_tracking_token;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_application(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_application(JSONB) TO anon, authenticated;

-- Replace the previous email/application-number lookup with a token-bound lookup.
DROP FUNCTION IF EXISTS public.track_application(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.track_application(
  p_application_number TEXT,
  p_email TEXT,
  p_tracking_token TEXT
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
    AND a.tracking_token_hash = encode(
      pg_catalog.digest(trim(p_tracking_token), 'sha256'),
      'hex'
    )
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.track_application(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_application(TEXT, TEXT, TEXT) TO anon, authenticated;
