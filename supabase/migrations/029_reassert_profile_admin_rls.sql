-- 029_reassert_profile_admin_rls.sql
-- Reassert the profile-based authorization boundary after the legacy migration
-- chain and remove stale public application-table policies.
-- Apply in order after 028 in a disposable Supabase project first.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE auth_user_id = auth.uid()
      AND role = 'admin'
      AND is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin can manage students" ON public.students;
CREATE POLICY "Admin can manage students"
  ON public.students
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.students TO authenticated;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read applications" ON public.applications;
DROP POLICY IF EXISTS "Public can read own applications" ON public.applications;
DROP POLICY IF EXISTS "Admin can manage applications" ON public.applications;
CREATE POLICY "Admin can manage applications"
  ON public.applications
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.applications FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.applications FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.applications TO authenticated;
