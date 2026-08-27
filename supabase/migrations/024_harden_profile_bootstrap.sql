-- Phase 3: harden Auth profile bootstrap
-- Never trust user-editable raw_user_meta_data for privileged role assignment.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, full_name, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data ->> 'full_name'), ''), 'User'),
    'student',
    true
  )
  ON CONFLICT (auth_user_id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      updated_at = now();

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;
