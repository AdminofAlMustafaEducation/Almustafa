-- 030_harden_helper_function_grants.sql
-- Remove unintended API execution privileges from internal helper functions.
-- `is_admin` is called by authenticated RLS policies; `handle_new_user` is
-- called by the Auth trigger and is not an API function.

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;
