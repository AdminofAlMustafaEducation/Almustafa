-- 020_phase2_security_fixes.sql
-- Phase 2: RLS fixes, missing tables, security improvements

-- ============================================================
-- 1. Enable RLS on notifications and chat_agents
-- ============================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_agents ENABLE ROW LEVEL SECURITY;

-- Notifications policies
DROP POLICY IF EXISTS "Admin can manage notifications" ON notifications;
CREATE POLICY "Admin can manage notifications" ON notifications FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Public can read active notifications" ON notifications;
CREATE POLICY "Public can read active notifications" ON notifications FOR SELECT
  USING (is_active = true AND user_id IS NULL);

DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Chat agents policies
DROP POLICY IF EXISTS "Admin can manage chat_agents" ON chat_agents;
CREATE POLICY "Admin can manage chat_agents" ON chat_agents FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Public can read active chat_agents" ON chat_agents;
CREATE POLICY "Public can read active chat_agents" ON chat_agents FOR SELECT
  USING (is_active = true);

-- ============================================================
-- 2. Fix RLS policies to use profiles table instead of JWT claims
-- ============================================================

-- Profiles
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
CREATE POLICY "Admin can read all profiles" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;
CREATE POLICY "Admin can manage all profiles" ON profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Students
DROP POLICY IF EXISTS "Admin can manage students" ON students;
CREATE POLICY "Admin can manage students" ON students FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Teachers
DROP POLICY IF EXISTS "Admin can manage teachers" ON teachers;
CREATE POLICY "Admin can manage teachers" ON teachers FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Applications
DROP POLICY IF EXISTS "Admin can manage applications" ON applications;
CREATE POLICY "Admin can manage applications" ON applications FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Guardians
DROP POLICY IF EXISTS "Admin can manage guardians" ON guardians;
CREATE POLICY "Admin can manage guardians" ON guardians FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin can manage student_guardians" ON student_guardians;
CREATE POLICY "Admin can manage student_guardians" ON student_guardians FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Classes
DROP POLICY IF EXISTS "Admin can manage classes" ON classes;
CREATE POLICY "Admin can manage classes" ON classes FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Subjects
DROP POLICY IF EXISTS "Admin can manage subjects" ON subjects;
CREATE POLICY "Admin can manage subjects" ON subjects FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Teacher assignments
DROP POLICY IF EXISTS "Admin can manage teacher_subjects" ON teacher_subjects;
CREATE POLICY "Admin can manage teacher_subjects" ON teacher_subjects FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Attendance
DROP POLICY IF EXISTS "Admin can manage attendance" ON attendance;
CREATE POLICY "Admin can manage attendance" ON attendance FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Exams
DROP POLICY IF EXISTS "Admin can manage exams" ON exams;
CREATE POLICY "Admin can manage exams" ON exams FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin can manage exam_results" ON exam_results;
CREATE POLICY "Admin can manage exam_results" ON exam_results FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Fees
DROP POLICY IF EXISTS "Admin can manage fee_invoices" ON fee_invoices;
CREATE POLICY "Admin can manage fee_invoices" ON fee_invoices FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin can manage payments" ON payments;
CREATE POLICY "Admin can manage payments" ON payments FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Notes
DROP POLICY IF EXISTS "Admin can manage notes" ON notes;
CREATE POLICY "Admin can manage notes" ON notes FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Live classes
DROP POLICY IF EXISTS "Admin can manage live_classes" ON live_classes;
CREATE POLICY "Admin can manage live_classes" ON live_classes FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Gallery
DROP POLICY IF EXISTS "Admin can manage gallery_items" ON gallery_items;
CREATE POLICY "Admin can manage gallery_items" ON gallery_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Website content
DROP POLICY IF EXISTS "Admin can manage website_content" ON website_content;
CREATE POLICY "Admin can manage website_content" ON website_content FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Audit logs
DROP POLICY IF EXISTS "Admin can read audit_logs" ON audit_logs;
CREATE POLICY "Admin can read audit_logs" ON audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- ============================================================
-- 3. Create missing tables (inquiries, batches)
-- ============================================================

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage inquiries" ON inquiries;
CREATE POLICY "Admin can manage inquiries" ON inquiries FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Public can insert inquiries" ON inquiries;
CREATE POLICY "Public can insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_level INT,
  grade TEXT,
  program TEXT,
  campus TEXT DEFAULT 'main',
  teacher_id UUID REFERENCES teachers(id),
  schedule TEXT,
  capacity INT DEFAULT 30,
  session TEXT DEFAULT '2026-27',
  academic_year TEXT DEFAULT '2026',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_batches_grade ON batches(grade);
CREATE INDEX IF NOT EXISTS idx_batches_is_active ON batches(is_active);

ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage batches" ON batches;
CREATE POLICY "Admin can manage batches" ON batches FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Authenticated can read batches" ON batches;
CREATE POLICY "Authenticated can read batches" ON batches FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- 4. Fix audit_logs policy
-- ============================================================

DROP POLICY IF EXISTS "System can insert audit_logs" ON audit_logs;
CREATE POLICY "System can insert audit_logs" ON audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- 5. Add student SELECT on live_classes
-- ============================================================

DROP POLICY IF EXISTS "Students can read class live_classes" ON live_classes;
CREATE POLICY "Students can read class live_classes" ON live_classes FOR SELECT
  USING (class_id IN (
    SELECT class_id FROM class_students
    WHERE student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid())
  ));

-- ============================================================
-- 6. Fix notes student policy (restrict to enrolled students)
-- ============================================================

DROP POLICY IF EXISTS "Students can read class notes" ON notes;
CREATE POLICY "Students can read class notes" ON notes FOR SELECT
  USING (
    is_published = true
    AND class_id IN (
      SELECT class_id FROM class_students
      WHERE student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid())
    )
  );
