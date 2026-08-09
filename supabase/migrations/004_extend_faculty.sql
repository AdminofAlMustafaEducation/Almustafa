-- 004_extend_faculty.sql
-- Rename faculty to teachers and extend

-- Create teachers table (separate from existing faculty)
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  photo TEXT,
  subject TEXT,
  designation TEXT,
  bio TEXT,
  campus TEXT DEFAULT 'main',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_teachers_auth_user_id ON teachers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_is_active ON teachers(is_active);

-- Enable RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Admin can manage all teachers
CREATE POLICY "Admin can manage teachers"
  ON teachers FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Teachers can read own profile
CREATE POLICY "Teachers can read own profile"
  ON teachers FOR SELECT
  USING (auth_user_id = auth.uid());

-- Teachers can update own profile
CREATE POLICY "Teachers can update own profile"
  ON teachers FOR UPDATE
  USING (auth_user_id = auth.uid());

-- Public can read active teachers (for website)
CREATE POLICY "Public can read active teachers"
  ON teachers FOR SELECT
  USING (is_active = true);
