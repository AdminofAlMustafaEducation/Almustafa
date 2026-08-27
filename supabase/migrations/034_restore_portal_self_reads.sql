-- 034_restore_portal_self_reads.sql
-- Restore the least-privilege reads required by the student and teacher portals.
-- Administrative writes remain protected by the active-profile admin policy.

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students can read own record" ON public.students;
CREATE POLICY "Students can read own record"
  ON public.students
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());
GRANT SELECT ON TABLE public.students TO authenticated;

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers can read own profile" ON public.teachers;
CREATE POLICY "Teachers can read own profile"
  ON public.teachers
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());
GRANT SELECT ON TABLE public.teachers TO authenticated;
