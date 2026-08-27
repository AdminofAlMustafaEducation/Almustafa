-- 032_remove_stale_broad_policies.sql
-- Remove legacy policies that bypass the profile-based admin boundary.

DROP POLICY IF EXISTS "Public can insert applications" ON public.applications;
DROP POLICY IF EXISTS "Authenticated users can manage students" ON public.students;

REVOKE INSERT, SELECT, UPDATE, DELETE ON TABLE public.applications FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.applications TO authenticated;
