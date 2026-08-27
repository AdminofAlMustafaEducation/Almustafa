-- 027_application_submission_controls.sql
-- Phase 6: database-side abuse control for anonymous application submission.
-- This is an email-based cooldown. Provider-level/IP-level rate limiting remains
-- required at the edge because Postgres does not receive the caller IP here.

CREATE INDEX IF NOT EXISTS idx_applications_email_created_at
  ON public.applications (email, created_at DESC);

CREATE OR REPLACE FUNCTION public.enforce_application_submission_cooldown()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Authenticated administrative/service workflows are not subject to the
  -- anonymous form cooldown. The Auth role is the durable distinction here.
  IF auth.role() = 'anon' AND EXISTS (
    SELECT 1
    FROM public.applications a
    WHERE lower(a.email) = lower(NEW.email)
      AND a.created_at > now() - interval '15 minutes'
  ) THEN
    RAISE EXCEPTION 'Please wait before submitting another application for this email address.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_application_submission_cooldown() FROM PUBLIC;

DROP TRIGGER IF EXISTS applications_submission_cooldown ON public.applications;
CREATE TRIGGER applications_submission_cooldown
  BEFORE INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_application_submission_cooldown();
