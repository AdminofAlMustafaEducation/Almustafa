-- 002_extend_students.sql
-- Extend existing students table with new fields

-- Add new columns to existing students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS student_number TEXT UNIQUE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id);
ALTER TABLE students ADD COLUMN IF NOT EXISTS identity_type TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS identity_number TEXT UNIQUE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS monthly_fee NUMERIC DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS student_whatsapp TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS student_whatsapp_verified BOOLEAN DEFAULT false;
ALTER TABLE students ADD COLUMN IF NOT EXISTS parent_whatsapp TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS parent_whatsapp_verified BOOLEAN DEFAULT false;
ALTER TABLE students ADD COLUMN IF NOT EXISTS guardian_name TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female'));

-- Create sequence for student numbers
CREATE SEQUENCE IF NOT EXISTS student_number_seq START 1001;

-- Function to auto-generate student number
CREATE OR REPLACE FUNCTION generate_student_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.student_number IS NULL THEN
    NEW.student_number := 'STU-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('student_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate student number
DROP TRIGGER IF EXISTS on_student_created ON students;
CREATE TRIGGER on_student_created
  BEFORE INSERT ON students
  FOR EACH ROW EXECUTE FUNCTION generate_student_number();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_auth_user_id ON students(auth_user_id);

-- Update RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Admin can manage all students
CREATE POLICY "Admin can manage students"
  ON students FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Students can read own data
CREATE POLICY "Students can read own data"
  ON students FOR SELECT
  USING (auth_user_id = auth.uid());

-- Backfill grade from class_level if needed
UPDATE students SET grade = CASE
  WHEN class_level = 9 THEN '9th'
  WHEN class_level = 10 THEN '10th'
  WHEN class_level = 11 THEN 'FSc Pre-Engineering'
  WHEN class_level = 12 THEN 'FSc Pre-Medical'
  ELSE '9th'
END WHERE grade IS NULL;
