-- 035_restore_portal_assignment_policies.sql
-- Restore least-privilege reads/writes required by the live student and
-- teacher portals. All policies are scoped to authenticated identities.

ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers can read assigned enrollments" ON public.class_students;
CREATE POLICY "Teachers can read assigned enrollments"
  ON public.class_students
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.teacher_subjects ts
      JOIN public.teachers t ON t.id = ts.teacher_id
      WHERE ts.class_id = class_students.class_id
        AND t.auth_user_id = auth.uid()
    )
  );
GRANT SELECT ON TABLE public.class_students TO authenticated;

ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers can read assigned results" ON public.exam_results;
CREATE POLICY "Teachers can read assigned results"
  ON public.exam_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.exams e
      JOIN public.teachers t ON t.id = e.teacher_id
      WHERE e.id = exam_results.exam_id
        AND t.auth_user_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "Teachers can manage assigned results" ON public.exam_results;
CREATE POLICY "Teachers can manage assigned results"
  ON public.exam_results
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.exams e
      JOIN public.teachers t ON t.id = e.teacher_id
      WHERE e.id = exam_results.exam_id
        AND t.auth_user_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can update assigned results"
  ON public.exam_results
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.exams e
      JOIN public.teachers t ON t.id = e.teacher_id
      WHERE e.id = exam_results.exam_id
        AND t.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.exams e
      JOIN public.teachers t ON t.id = e.teacher_id
      WHERE e.id = exam_results.exam_id
        AND t.auth_user_id = auth.uid()
    )
  );
GRANT SELECT, INSERT, UPDATE ON TABLE public.exam_results TO authenticated;
