-- 016_create_rls_policies.sql
-- Additional RLS policies and class_students junction table

-- Class students junction table
CREATE TABLE IF NOT EXISTS class_students (
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_year TEXT DEFAULT '2026',
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (class_id, student_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_class_students_class ON class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON class_students(student_id);

-- Enable RLS
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;

-- Admin can manage all enrollments
CREATE POLICY "Admin can manage class_students"
  ON class_students FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Students can read own enrollments
CREATE POLICY "Students can read own enrollments"
  ON class_students FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid()));

-- Teachers can read enrollments for their assigned classes
CREATE POLICY "Teachers can read assigned class enrollments"
  ON class_students FOR SELECT
  USING (class_id IN (
    SELECT class_id FROM teacher_subjects
    WHERE teacher_id IN (SELECT id FROM teachers WHERE auth_user_id = auth.uid())
  ));

-- Guardians can read linked student enrollments
CREATE POLICY "Guardians can read linked enrollments"
  ON class_students FOR SELECT
  USING (student_id IN (
    SELECT sg.student_id FROM student_guardians sg
    JOIN guardians g ON g.id = sg.guardian_id
    WHERE g.auth_user_id = auth.uid()
  ));
