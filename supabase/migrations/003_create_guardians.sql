-- 003_create_guardians.sql
-- Guardians table and junction table

CREATE TABLE IF NOT EXISTS guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id),
  name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  cnic TEXT,
  relationship TEXT CHECK (relationship IN ('father', 'mother', 'brother', 'sister', 'guardian', 'other')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Junction table: guardian <-> student
CREATE TABLE IF NOT EXISTS student_guardians (
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (student_id, guardian_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_guardians_auth_user_id ON guardians(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_student_guardians_student ON student_guardians(student_id);
CREATE INDEX IF NOT EXISTS idx_student_guardians_guardian ON student_guardians(guardian_id);

-- Enable RLS
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;

-- Admin can manage all guardians
CREATE POLICY "Admin can manage guardians"
  ON guardians FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Admin can manage all student_guardians
CREATE POLICY "Admin can manage student_guardians"
  ON student_guardians FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Guardians can read own profile
CREATE POLICY "Guardians can read own profile"
  ON guardians FOR SELECT
  USING (auth_user_id = auth.uid());

-- Guardians can read linked students
CREATE POLICY "Guardians can read linked students"
  ON student_guardians FOR SELECT
  USING (guardian_id IN (SELECT id FROM guardians WHERE auth_user_id = auth.uid()));

-- Students can read linked guardians
CREATE POLICY "Students can read linked guardians"
  ON student_guardians FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid()));
