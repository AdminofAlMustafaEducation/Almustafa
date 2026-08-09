-- 010_create_notes.sql
-- Teacher notes/study materials

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_type TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notes_teacher ON notes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_class ON notes(class_id);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Admin can manage all notes
CREATE POLICY "Admin can manage notes"
  ON notes FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Teachers can manage own notes
CREATE POLICY "Teachers can manage own notes"
  ON notes FOR ALL
  USING (teacher_id IN (SELECT id FROM teachers WHERE auth_user_id = auth.uid()));

-- Students can read notes for their class
CREATE POLICY "Students can read class notes"
  ON notes FOR SELECT
  USING (
    is_published = true AND
    class_id IN (
      SELECT class_id FROM class_students
      WHERE student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid())
    )
  );

-- Guardians can read linked student notes
CREATE POLICY "Guardians can read linked notes"
  ON notes FOR SELECT
  USING (
    is_published = true AND
    class_id IN (
      SELECT cs.class_id FROM class_students cs
      JOIN student_guardians sg ON sg.student_id = cs.student_id
      JOIN guardians g ON g.id = sg.guardian_id
      WHERE g.auth_user_id = auth.uid()
    )
  );
