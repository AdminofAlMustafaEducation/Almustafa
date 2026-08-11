-- 021_fix_rls_recursion.sql
-- Fix infinite recursion in profiles RLS policies
-- ROOT CAUSE: Policies on profiles table query profiles table itself,
-- causing infinite recursion. Solution: use a SECURITY DEFINER function.

-- ============================================================
-- 1. Create is_admin() function (SECURITY DEFINER bypasses RLS)
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 2. Fix profiles table policies
-- ============================================================

-- Drop the recursive policies
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;

-- Recreate with is_admin() function
CREATE POLICY "Admin can read all profiles" ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can manage all profiles" ON profiles FOR ALL
  USING (is_admin());

-- ============================================================
-- 3. Fix ALL other table policies that use the recursive pattern
-- ============================================================

-- Students
DROP POLICY IF EXISTS "Admin can manage students" ON students;
CREATE POLICY "Admin can manage students" ON students FOR ALL
  USING (is_admin());

-- Teachers
DROP POLICY IF EXISTS "Admin can manage teachers" ON teachers;
CREATE POLICY "Admin can manage teachers" ON teachers FOR ALL
  USING (is_admin());

-- Applications
DROP POLICY IF EXISTS "Admin can manage applications" ON applications;
CREATE POLICY "Admin can manage applications" ON applications FOR ALL
  USING (is_admin());

-- Add public SELECT policy for applications (needed for apply form and track page)
-- NOTE: This exposes ALL application data publicly. Consider restricting later
-- by creating a view with limited columns or using a more restrictive policy.
DROP POLICY IF EXISTS "Public can read own applications" ON applications;
CREATE POLICY "Public can read own applications" ON applications FOR SELECT
  USING (true);

-- Guardians
DROP POLICY IF EXISTS "Admin can manage guardians" ON guardians;
CREATE POLICY "Admin can manage guardians" ON guardians FOR ALL
  USING (is_admin());

-- Student Guardians
DROP POLICY IF EXISTS "Admin can manage student_guardians" ON student_guardians;
CREATE POLICY "Admin can manage student_guardians" ON student_guardians FOR ALL
  USING (is_admin());

-- Classes
DROP POLICY IF EXISTS "Admin can manage classes" ON classes;
CREATE POLICY "Admin can manage classes" ON classes FOR ALL
  USING (is_admin());

-- Subjects
DROP POLICY IF EXISTS "Admin can manage subjects" ON subjects;
CREATE POLICY "Admin can manage subjects" ON subjects FOR ALL
  USING (is_admin());

-- Teacher Subjects
DROP POLICY IF EXISTS "Admin can manage teacher_subjects" ON teacher_subjects;
CREATE POLICY "Admin can manage teacher_subjects" ON teacher_subjects FOR ALL
  USING (is_admin());

-- Attendance
DROP POLICY IF EXISTS "Admin can manage attendance" ON attendance;
CREATE POLICY "Admin can manage attendance" ON attendance FOR ALL
  USING (is_admin());

-- Exams
DROP POLICY IF EXISTS "Admin can manage exams" ON exams;
CREATE POLICY "Admin can manage exams" ON exams FOR ALL
  USING (is_admin());

-- Exam Results
DROP POLICY IF EXISTS "Admin can manage exam_results" ON exam_results;
CREATE POLICY "Admin can manage exam_results" ON exam_results FOR ALL
  USING (is_admin());

-- Fee Invoices
DROP POLICY IF EXISTS "Admin can manage fee_invoices" ON fee_invoices;
CREATE POLICY "Admin can manage fee_invoices" ON fee_invoices FOR ALL
  USING (is_admin());

-- Payments
DROP POLICY IF EXISTS "Admin can manage payments" ON payments;
CREATE POLICY "Admin can manage payments" ON payments FOR ALL
  USING (is_admin());

-- Notes
DROP POLICY IF EXISTS "Admin can manage notes" ON notes;
CREATE POLICY "Admin can manage notes" ON notes FOR ALL
  USING (is_admin());

-- Live Classes
DROP POLICY IF EXISTS "Admin can manage live_classes" ON live_classes;
CREATE POLICY "Admin can manage live_classes" ON live_classes FOR ALL
  USING (is_admin());

-- Gallery Items
DROP POLICY IF EXISTS "Admin can manage gallery_items" ON gallery_items;
CREATE POLICY "Admin can manage gallery_items" ON gallery_items FOR ALL
  USING (is_admin());

-- Website Content
DROP POLICY IF EXISTS "Admin can manage website_content" ON website_content;
CREATE POLICY "Admin can manage website_content" ON website_content FOR ALL
  USING (is_admin());

-- Audit Logs
DROP POLICY IF EXISTS "Admin can read audit_logs" ON audit_logs;
CREATE POLICY "Admin can read audit_logs" ON audit_logs FOR SELECT
  USING (is_admin());

-- Notifications
DROP POLICY IF EXISTS "Admin can manage notifications" ON notifications;
CREATE POLICY "Admin can manage notifications" ON notifications FOR ALL
  USING (is_admin());

-- Chat Agents
DROP POLICY IF EXISTS "Admin can manage chat_agents" ON chat_agents;
CREATE POLICY "Admin can manage chat_agents" ON chat_agents FOR ALL
  USING (is_admin());

-- Inquiries
DROP POLICY IF EXISTS "Admin can manage inquiries" ON inquiries;
CREATE POLICY "Admin can manage inquiries" ON inquiries FOR ALL
  USING (is_admin());

-- Batches
DROP POLICY IF EXISTS "Admin can manage batches" ON batches;
CREATE POLICY "Admin can manage batches" ON batches FOR ALL
  USING (is_admin());

-- Class Students
DROP POLICY IF EXISTS "Admin can manage class_students" ON class_students;
CREATE POLICY "Admin can manage class_students" ON class_students FOR ALL
  USING (is_admin());

-- Application Status History
DROP POLICY IF EXISTS "Admin can manage application_history" ON application_status_history;
CREATE POLICY "Admin can manage application_history" ON application_status_history FOR ALL
  USING (is_admin());
