-- 005_create_classes_subjects.sql
-- Classes and subjects tables

-- Classes table (Grade 9-A, Grade 9-B, etc.)
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT,
  academic_year TEXT DEFAULT '2026',
  capacity INT DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_classes_grade ON classes(grade);
CREATE INDEX IF NOT EXISTS idx_classes_is_active ON classes(is_active);

-- Enable RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Admin can manage classes
CREATE POLICY "Admin can manage classes"
  ON classes FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Admin can manage subjects
CREATE POLICY "Admin can manage subjects"
  ON subjects FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Authenticated users can read classes
CREATE POLICY "Authenticated can read classes"
  ON classes FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can read subjects
CREATE POLICY "Authenticated can read subjects"
  ON subjects FOR SELECT
  USING (auth.role() = 'authenticated');

-- Public can read active classes and subjects
CREATE POLICY "Public can read active classes"
  ON classes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read active subjects"
  ON subjects FOR SELECT
  USING (is_active = true);
