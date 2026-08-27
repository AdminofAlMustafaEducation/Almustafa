-- 031_harden_remaining_function_boundaries.sql
-- Fix remaining Supabase advisor warnings on legacy functions and prevent
-- internal trigger/audit helpers from being exposed through PostgREST.

ALTER FUNCTION public.generate_application_number()
  SET search_path = public, extensions, pg_temp;
ALTER FUNCTION public.generate_student_number()
  SET search_path = public, extensions, pg_temp;
ALTER FUNCTION public.calculate_grade(NUMERIC, NUMERIC)
  SET search_path = public, extensions, pg_temp;
ALTER FUNCTION public.auto_calculate_grade()
  SET search_path = public, extensions, pg_temp;
ALTER FUNCTION public.generate_invoice_number()
  SET search_path = public, extensions, pg_temp;
ALTER FUNCTION public.update_invoice_status()
  SET search_path = public, extensions, pg_temp;
ALTER FUNCTION public.approve_application(UUID, UUID)
  SET search_path = public, extensions, pg_temp;
ALTER FUNCTION public.generate_monthly_fees(TEXT, NUMERIC)
  SET search_path = public, extensions, pg_temp;
ALTER FUNCTION public.log_audit_event(UUID, TEXT, TEXT, UUID, JSONB, JSONB)
  SET search_path = public, extensions, pg_temp;
ALTER FUNCTION public.enforce_application_submission_cooldown()
  SET search_path = public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.enforce_application_submission_cooldown()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.log_audit_event(UUID, TEXT, TEXT, UUID, JSONB, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_audit_event(UUID, TEXT, TEXT, UUID, JSONB, JSONB)
  TO postgres, service_role;

REVOKE ALL ON FUNCTION public.generate_monthly_fees(TEXT, NUMERIC)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_monthly_fees(TEXT, NUMERIC)
  TO service_role;

REVOKE ALL ON FUNCTION public.approve_application(UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_application(UUID, UUID)
  TO service_role;
