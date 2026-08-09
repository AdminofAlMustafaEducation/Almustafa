-- 007_create_attendance.sql
-- Attendance table

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, class_id, subject_id, attendance_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_teacher ON attendance(teacher_id);

-- Enable RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Admin can manage all attendance
CREATE POLICY "Admin can manage attendance"
  ON attendance FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Teachers can manage attendance for assigned classes
CREATE POLICY "Teachers can manage assigned attendance"
  ON attendance FOR ALL
  USING (teacher_id IN (SELECT id FROM teachers WHERE auth_user_id = auth.uid()));

-- Students can read own attendance
CREATE POLICY "Students can read own attendance"
  ON attendance FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid()));

-- Guardians can read linked student attendance
CREATE POLICY "Guardians can read linked attendance"
  ON attendance FOR SELECT
  USING (student_id IN (
    SELECT sg.student_id FROM student_guardians sg
    JOIN guardians g ON g.id = sg.guardian_id
    WHERE g.auth_user_id = auth.uid()
  ));
