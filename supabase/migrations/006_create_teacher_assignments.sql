-- 006_create_teacher_assignments.sql
-- Teacher subject/class assignments

CREATE TABLE IF NOT EXISTS teacher_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  academic_year TEXT DEFAULT '2026',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(teacher_id, subject_id, class_id, academic_year)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_teacher ON teacher_subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_subject ON teacher_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_class ON teacher_subjects(class_id);

-- Enable RLS
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;

-- Admin can manage all assignments
CREATE POLICY "Admin can manage teacher_subjects"
  ON teacher_subjects FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Teachers can read own assignments
CREATE POLICY "Teachers can read own assignments"
  ON teacher_subjects FOR SELECT
  USING (teacher_id IN (SELECT id FROM teachers WHERE auth_user_id = auth.uid()));

-- Students can read assignments for their class
CREATE POLICY "Students can read class assignments"
  ON teacher_subjects FOR SELECT
  USING (class_id IN (
    SELECT class_id FROM class_students
    WHERE student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid())
  ));
