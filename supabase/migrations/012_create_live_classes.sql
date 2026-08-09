-- 012_create_live_classes.sql
-- Live classes table for Google Meet integration

CREATE TABLE IF NOT EXISTS live_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  meeting_url TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_live_classes_class ON live_classes(class_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_teacher ON live_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_start_time ON live_classes(start_time);
CREATE INDEX IF NOT EXISTS idx_live_classes_status ON live_classes(status);

-- Enable RLS
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;

-- Admin can manage all live classes
CREATE POLICY "Admin can manage live_classes"
  ON live_classes FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Teachers can manage own live classes
CREATE POLICY "Teachers can manage own live_classes"
  ON live_classes FOR ALL
  USING (teacher_id IN (SELECT id FROM teachers WHERE auth_user_id = auth.uid()));

-- Students can read live classes for their class
CREATE POLICY "Students can read class live_classes"
  ON live_classes FOR SELECT
  USING (class_id IN (
    SELECT class_id FROM class_students
    WHERE student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid())
  ));

-- Guardians can read linked student live classes
CREATE POLICY "Guardians can read linked live_classes"
  ON live_classes FOR SELECT
  USING (class_id IN (
    SELECT cs.class_id FROM class_students cs
    JOIN student_guardians sg ON sg.student_id = cs.student_id
    JOIN guardians g ON g.id = sg.guardian_id
    WHERE g.auth_user_id = auth.uid()
  ));
