-- =====================================================
-- AL-MUSTAFA ACADEMY - DATABASE MIGRATION SNAPSHOT
-- NON-CANONICAL: use the ordered files under supabase/migrations/ for shared environments.
-- Do not run this snapshot against production until it is generated and verified from that chain.
-- =====================================================

-- ============================================================
-- 001: Create Profiles Table
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'guardian')),
  phone TEXT,
  whatsapp TEXT,
  photo TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth_user_id = auth.uid());
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth_user_id = auth.uid());
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
CREATE POLICY "Admin can read all profiles" ON profiles FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;
CREATE POLICY "Admin can manage all profiles" ON profiles FOR ALL USING (is_admin());

-- is_admin() function: bypasses RLS by using SECURITY DEFINER
-- This prevents infinite recursion when policies on profiles table
-- need to check if the current user is an admin.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (auth_user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 002: Extend Students Table
-- ============================================================

-- Create students table if it doesn't exist
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_number TEXT UNIQUE,
  auth_user_id UUID UNIQUE REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  father_name TEXT,
  guardian_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  id_number TEXT,
  identity_type TEXT,
  identity_number TEXT UNIQUE,
  student_whatsapp TEXT,
  student_whatsapp_verified BOOLEAN DEFAULT false,
  parent_whatsapp TEXT,
  parent_whatsapp_verified BOOLEAN DEFAULT false,
  grade TEXT,
  class_id UUID,
  monthly_fee NUMERIC DEFAULT 0,
  email TEXT,
  phone TEXT,
  address TEXT,
  roll_number TEXT,
  photo TEXT,
  photo_url TEXT,
  admission_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'withdrawn')),
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns if table already exists
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
ALTER TABLE students ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS password TEXT;

CREATE SEQUENCE IF NOT EXISTS student_number_seq START 1001;

-- ============================================================
-- 002b: Create Applications Table
-- ============================================================

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  student_name TEXT,
  father_name TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  identity_type TEXT,
  identity_number TEXT,
  id_number TEXT,
  gender TEXT,
  grade TEXT,
  dob TEXT,
  date_of_birth TEXT,
  address TEXT,
  previous_school TEXT,
  previous_marks TEXT,
  guardian_occupation TEXT,
  message TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  parent_cnic TEXT,
  photo_url TEXT,
  documents TEXT[],
  class_level INT,
  program TEXT,
  campus TEXT,
  password TEXT,
  tracking_code TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'reviewing', 'approved', 'rejected', 'enrolled', 'withdrawn')),
  reviewer_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  student_id UUID REFERENCES students(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_tracking_code ON applications(tracking_code);

-- Sequence for application numbers
CREATE SEQUENCE IF NOT EXISTS application_number_seq START 1001;

-- Function to auto-generate application number
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_number IS NULL OR NEW.application_number = '' THEN
    NEW.application_number := 'AMA-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('application_number_seq')::TEXT, 4, '0');
  END IF;
  IF NEW.tracking_code IS NULL OR NEW.tracking_code = '' THEN
    NEW.tracking_code := NEW.application_number;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_application_created ON applications;
CREATE TRIGGER on_application_created
  BEFORE INSERT ON applications
  FOR EACH ROW EXECUTE FUNCTION generate_application_number();

-- Application Status History
CREATE TABLE IF NOT EXISTS application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID,
  changed_at TIMESTAMPTZ DEFAULT now(),
  reason TEXT
);

-- Approve & Create Account RPC
CREATE OR REPLACE FUNCTION approve_and_create_account(
  app_id UUID,
  reviewer_id UUID
)
RETURNS JSONB AS $$
DECLARE
  app RECORD;
  new_student_id UUID;
  new_student_number TEXT;
  result JSONB;
BEGIN
  SELECT * INTO app FROM applications WHERE id = app_id FOR UPDATE;

  IF app.status NOT IN ('pending', 'under_review', 'reviewing') THEN
    RAISE EXCEPTION 'Cannot approve application with status: %', app.status;
  END IF;

  IF app.email IS NOT NULL AND app.email != '' THEN
    IF EXISTS (SELECT 1 FROM students WHERE email = app.email) THEN
      RAISE EXCEPTION 'Student with email % already exists', app.email;
    END IF;
  END IF;

  IF app.identity_number IS NOT NULL AND app.identity_number != '' THEN
    IF EXISTS (SELECT 1 FROM students WHERE identity_number = app.identity_number) THEN
      RAISE EXCEPTION 'Student with identity number % already exists', app.identity_number;
    END IF;
  END IF;

  new_student_number := 'STU-' || EXTRACT(YEAR FROM NOW()) || '-' ||
    LPAD(nextval('student_number_seq')::TEXT, 4, '0');

  INSERT INTO students (student_number, full_name, father_name, phone,
    identity_type, identity_number, gender, grade, address,
    admission_date, monthly_fee, status, email, password)
  VALUES (new_student_number, app.full_name, COALESCE(app.father_name, ''), app.phone,
    'b_form', app.identity_number, COALESCE(app.gender, 'male'),
    COALESCE(app.grade, '9th'), COALESCE(app.address, ''),
    CURRENT_DATE, 0, 'active', app.email, app.password)
  RETURNING id INTO new_student_id;

  UPDATE applications
  SET status = 'approved',
      student_id = new_student_id,
      reviewed_by = reviewer_id,
      reviewed_at = now(),
      updated_at = now()
  WHERE id = app_id;

  INSERT INTO application_status_history
    (application_id, old_status, new_status, changed_by, reason)
  VALUES (app_id, app.status, 'approved', reviewer_id, 'Approved and student admitted');

  result := jsonb_build_object(
    'student_id', new_student_id,
    'student_number', new_student_number,
    'application_number', app.application_number
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage applications" ON applications;
CREATE POLICY "Admin can manage applications" ON applications FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Public can insert applications" ON applications;
CREATE POLICY "Public can insert applications" ON applications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can read own applications" ON applications;
CREATE POLICY "Public can read own applications" ON applications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin can manage application_history" ON application_status_history;
CREATE POLICY "Admin can manage application_history" ON application_status_history FOR ALL USING (is_admin());

CREATE OR REPLACE FUNCTION generate_student_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.student_number IS NULL THEN
    NEW.student_number := 'STU-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('student_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_student_created ON students;
CREATE TRIGGER on_student_created
  BEFORE INSERT ON students
  FOR EACH ROW EXECUTE FUNCTION generate_student_number();

CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_auth_user_id ON students(auth_user_id);

-- Backfill grade from class_level
UPDATE students SET grade = CASE
  WHEN class_level = 9 THEN '9th'
  WHEN class_level = 10 THEN '10th'
  WHEN class_level = 11 THEN 'FSc Pre-Engineering'
  WHEN class_level = 12 THEN 'FSc Pre-Medical'
  ELSE '9th'
END WHERE grade IS NULL;

-- ============================================================
-- 003: Create Guardians Tables
-- ============================================================

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

CREATE TABLE IF NOT EXISTS student_guardians (
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (student_id, guardian_id)
);

CREATE INDEX IF NOT EXISTS idx_guardians_auth_user_id ON guardians(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_student_guardians_student ON student_guardians(student_id);
CREATE INDEX IF NOT EXISTS idx_student_guardians_guardian ON student_guardians(guardian_id);

ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage guardians" ON guardians;
CREATE POLICY "Admin can manage guardians" ON guardians FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Admin can manage student_guardians" ON student_guardians;
CREATE POLICY "Admin can manage student_guardians" ON student_guardians FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Guardians can read own profile" ON guardians;
CREATE POLICY "Guardians can read own profile" ON guardians FOR SELECT USING (auth_user_id = auth.uid());
DROP POLICY IF EXISTS "Guardians can read linked students" ON student_guardians;
CREATE POLICY "Guardians can read linked students" ON student_guardians FOR SELECT USING (guardian_id IN (SELECT id FROM guardians WHERE auth_user_id = auth.uid()));
DROP POLICY IF EXISTS "Students can read linked guardians" ON student_guardians;
CREATE POLICY "Students can read linked guardians" ON student_guardians FOR SELECT USING (student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid()));

-- ============================================================
-- 004: Create Teachers Table
-- ============================================================

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
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teachers_auth_user_id ON teachers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_is_active ON teachers(is_active);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage teachers" ON teachers;
CREATE POLICY "Admin can manage teachers" ON teachers FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Teachers can read own profile" ON teachers;
CREATE POLICY "Teachers can read own profile" ON teachers FOR SELECT USING (auth_user_id = auth.uid());
DROP POLICY IF EXISTS "Teachers can update own profile" ON teachers;
CREATE POLICY "Teachers can update own profile" ON teachers FOR UPDATE USING (auth_user_id = auth.uid());
DROP POLICY IF EXISTS "Public can read active teachers" ON teachers;
CREATE POLICY "Public can read active teachers" ON teachers FOR SELECT USING (is_active = true);

-- ============================================================
-- 005: Create Classes and Subjects Tables
-- ============================================================

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

CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_classes_grade ON classes(grade);
CREATE INDEX IF NOT EXISTS idx_classes_is_active ON classes(is_active);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage classes" ON classes;
CREATE POLICY "Admin can manage classes" ON classes FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Admin can manage subjects" ON subjects;
CREATE POLICY "Admin can manage subjects" ON subjects FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Authenticated can read classes" ON classes;
CREATE POLICY "Authenticated can read classes" ON classes FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated can read subjects" ON subjects;
CREATE POLICY "Authenticated can read subjects" ON subjects FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public can read active classes" ON classes;
CREATE POLICY "Public can read active classes" ON classes FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public can read active subjects" ON subjects;
CREATE POLICY "Public can read active subjects" ON subjects FOR SELECT USING (is_active = true);

-- ============================================================
-- 006: Create Teacher Assignments Table
-- ============================================================

CREATE TABLE IF NOT EXISTS teacher_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  academic_year TEXT DEFAULT '2026',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(teacher_id, subject_id, class_id, academic_year)
);

CREATE INDEX IF NOT EXISTS idx_teacher_subjects_teacher ON teacher_subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_subject ON teacher_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_class ON teacher_subjects(class_id);

ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage teacher_subjects" ON teacher_subjects;
CREATE POLICY "Admin can manage teacher_subjects" ON teacher_subjects FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Teachers can read own assignments" ON teacher_subjects;
CREATE POLICY "Teachers can read own assignments" ON teacher_subjects FOR SELECT USING (teacher_id IN (SELECT id FROM teachers WHERE auth_user_id = auth.uid()));

-- ============================================================
-- 007: Create Attendance Table
-- ============================================================

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

CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_teacher ON attendance(teacher_id);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage attendance" ON attendance;
CREATE POLICY "Admin can manage attendance" ON attendance FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Teachers can manage assigned attendance" ON attendance;
CREATE POLICY "Teachers can manage assigned attendance" ON attendance FOR ALL USING (teacher_id IN (SELECT id FROM teachers WHERE auth_user_id = auth.uid()));
DROP POLICY IF EXISTS "Students can read own attendance" ON attendance;
CREATE POLICY "Students can read own attendance" ON attendance FOR SELECT USING (student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid()));

-- ============================================================
-- 008: Create Exams and Results Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  exam_date DATE DEFAULT CURRENT_DATE,
  total_marks INT NOT NULL CHECK (total_marks > 0),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'completed', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  marks_obtained NUMERIC NOT NULL CHECK (marks_obtained >= 0),
  grade TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(exam_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_exams_class ON exams(class_id);
CREATE INDEX IF NOT EXISTS idx_exams_subject ON exams(subject_id);
CREATE INDEX IF NOT EXISTS idx_exams_teacher ON exams(teacher_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_exam ON exam_results(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_student ON exam_results(student_id);

CREATE OR REPLACE FUNCTION calculate_grade(marks NUMERIC, total_marks NUMERIC)
RETURNS TEXT AS $$
BEGIN
  IF total_marks <= 0 THEN RETURN '-'; END IF;
  IF marks < 0 OR marks > total_marks THEN RETURN 'INVALID'; END IF;
  CASE
    WHEN (marks / total_marks * 100) >= 90 THEN RETURN 'A+';
    WHEN (marks / total_marks * 100) >= 80 THEN RETURN 'A';
    WHEN (marks / total_marks * 100) >= 70 THEN RETURN 'B';
    WHEN (marks / total_marks * 100) >= 60 THEN RETURN 'C';
    WHEN (marks / total_marks * 100) >= 50 THEN RETURN 'D';
    ELSE RETURN 'F';
  END CASE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION auto_calculate_grade()
RETURNS TRIGGER AS $$
DECLARE
  exam_total INT;
BEGIN
  SELECT total_marks INTO exam_total FROM exams WHERE id = NEW.exam_id;
  NEW.grade := calculate_grade(NEW.marks_obtained, exam_total);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_exam_result_created ON exam_results;
CREATE TRIGGER on_exam_result_created
  BEFORE INSERT OR UPDATE ON exam_results
  FOR EACH ROW EXECUTE FUNCTION auto_calculate_grade();

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage exams" ON exams;
CREATE POLICY "Admin can manage exams" ON exams FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Admin can manage exam_results" ON exam_results;
CREATE POLICY "Admin can manage exam_results" ON exam_results FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Teachers can manage assigned exams" ON exams;
CREATE POLICY "Teachers can manage assigned exams" ON exams FOR ALL USING (teacher_id IN (SELECT id FROM teachers WHERE auth_user_id = auth.uid()));
DROP POLICY IF EXISTS "Students can read own results" ON exam_results;
CREATE POLICY "Students can read own results" ON exam_results FOR SELECT USING (student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid()));

-- ============================================================
-- 009: Create Fee Invoices and Payments Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS fee_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  billing_month TEXT NOT NULL,
  fee_type TEXT DEFAULT 'monthly' CHECK (fee_type IN ('monthly', 'admission', 'exam', 'transport', 'other')),
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  due_date DATE,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('draft', 'unpaid', 'partial', 'paid', 'overdue', 'cancelled', 'waived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, billing_month, fee_type)
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES fee_invoices(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  paid_at TIMESTAMPTZ DEFAULT now(),
  method TEXT CHECK (method IN ('cash', 'bank', 'online', 'other')),
  reference TEXT,
  received_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fee_invoices_student ON fee_invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_invoices_status ON fee_invoices(status);
CREATE INDEX IF NOT EXISTS idx_fee_invoices_billing_month ON fee_invoices(billing_month);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);

CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1001;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := 'INV-' || COALESCE(NEW.billing_month, to_char(now(), 'YYYY-MM')) || '-' || LPAD(nextval('invoice_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_invoice_created ON fee_invoices;
CREATE TRIGGER on_invoice_created
  BEFORE INSERT ON fee_invoices
  FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
DECLARE
  total_paid NUMERIC;
  invoice_amount NUMERIC;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO total_paid FROM payments WHERE invoice_id = NEW.invoice_id;
  SELECT amount INTO invoice_amount FROM fee_invoices WHERE id = NEW.invoice_id;
  IF total_paid >= invoice_amount THEN
    UPDATE fee_invoices SET status = 'paid', updated_at = now() WHERE id = NEW.invoice_id;
  ELSIF total_paid > 0 THEN
    UPDATE fee_invoices SET status = 'partial', updated_at = now() WHERE id = NEW.invoice_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_payment_created ON payments;
CREATE TRIGGER on_payment_created
  AFTER INSERT ON payments
  FOR EACH ROW EXECUTE FUNCTION update_invoice_status();

ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage fee_invoices" ON fee_invoices;
CREATE POLICY "Admin can manage fee_invoices" ON fee_invoices FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Admin can manage payments" ON payments;
CREATE POLICY "Admin can manage payments" ON payments FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Students can read own invoices" ON fee_invoices;
CREATE POLICY "Students can read own invoices" ON fee_invoices FOR SELECT USING (student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid()));

-- ============================================================
-- 010: Create Notes Table
-- ============================================================

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

CREATE INDEX IF NOT EXISTS idx_notes_teacher ON notes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_class ON notes(class_id);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage notes" ON notes;
CREATE POLICY "Admin can manage notes" ON notes FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Teachers can manage own notes" ON notes;
CREATE POLICY "Teachers can manage own notes" ON notes FOR ALL USING (teacher_id IN (SELECT id FROM teachers WHERE auth_user_id = auth.uid()));
DROP POLICY IF EXISTS "Students can read class notes" ON notes;
CREATE POLICY "Students can read class notes" ON notes FOR SELECT USING (is_published = true AND class_id IN (SELECT id FROM classes));

-- ============================================================
-- 011: Extend Notifications Table
-- ============================================================

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  type TEXT DEFAULT 'general',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  is_read BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  reference_type TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create chat_agents table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  whatsapp_number TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns if tables already exist
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS reference_type TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS reference_id UUID;

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- ============================================================
-- 012: Create Live Classes Table
-- ============================================================

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

CREATE INDEX IF NOT EXISTS idx_live_classes_class ON live_classes(class_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_teacher ON live_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_start_time ON live_classes(start_time);

ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage live_classes" ON live_classes;
CREATE POLICY "Admin can manage live_classes" ON live_classes FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Teachers can manage own live_classes" ON live_classes;
CREATE POLICY "Teachers can manage own live_classes" ON live_classes FOR ALL USING (teacher_id IN (SELECT id FROM teachers WHERE auth_user_id = auth.uid()));

-- ============================================================
-- 013: Create Gallery Table
-- ============================================================

CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  storage_path TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_items_is_published ON gallery_items(is_published);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage gallery_items" ON gallery_items;
CREATE POLICY "Admin can manage gallery_items" ON gallery_items FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Public can read published gallery" ON gallery_items;
CREATE POLICY "Public can read published gallery" ON gallery_items FOR SELECT USING (is_published = true);

-- ============================================================
-- 014: Create Website Content Table
-- ============================================================

CREATE TABLE IF NOT EXISTS website_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  published BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_website_content_key ON website_content(key);

ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage website_content" ON website_content;
CREATE POLICY "Admin can manage website_content" ON website_content FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Public can read published website_content" ON website_content;
CREATE POLICY "Public can read published website_content" ON website_content FOR SELECT USING (published = true);

-- ============================================================
-- 015: Create Audit Logs Table
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can read audit_logs" ON audit_logs;
CREATE POLICY "Admin can read audit_logs" ON audit_logs FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "System can insert audit_logs" ON audit_logs;
CREATE POLICY "System can insert audit_logs" ON audit_logs FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION log_audit_event(
  p_actor_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, old_data, new_data)
  VALUES (p_actor_id, p_action, p_entity_type, p_entity_id, p_old_data, p_new_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 016: Create Class Students Junction Table
-- ============================================================

CREATE TABLE IF NOT EXISTS class_students (
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_year TEXT DEFAULT '2026',
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (class_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_class_students_class ON class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON class_students(student_id);

ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage class_students" ON class_students;
CREATE POLICY "Admin can manage class_students" ON class_students FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Students can read own enrollments" ON class_students;
CREATE POLICY "Students can read own enrollments" ON class_students FOR SELECT USING (student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid()));

-- ============================================================
-- 017: Create RPC Functions
-- ============================================================

CREATE OR REPLACE FUNCTION approve_application(app_id UUID, reviewer_id UUID)
RETURNS UUID AS $$
DECLARE
  app RECORD;
  new_student_id UUID;
  new_student_number TEXT;
BEGIN
  SELECT * INTO app FROM applications WHERE id = app_id FOR UPDATE;

  IF app.status NOT IN ('pending', 'under_review', 'reviewing') THEN
    RAISE EXCEPTION 'Cannot approve application with status: %', app.status;
  END IF;

  IF app.identity_number IS NOT NULL AND app.identity_number != '' THEN
    IF EXISTS (SELECT 1 FROM students WHERE identity_number = app.identity_number) THEN
      RAISE EXCEPTION 'Student with identity number % already exists', app.identity_number;
    END IF;
  END IF;

  new_student_number := 'STU-' || EXTRACT(YEAR FROM NOW()) || '-' ||
    LPAD(nextval('student_number_seq')::TEXT, 4, '0');

  INSERT INTO students (student_number, full_name, father_name, phone,
    identity_type, identity_number, gender, grade, address,
    admission_date, monthly_fee, status)
  VALUES (new_student_number, app.full_name, COALESCE(app.father_name, ''), app.phone,
    COALESCE(app.identity_type, 'b_form'), app.identity_number,
    COALESCE(app.gender, 'male'), COALESCE(app.grade, '9th'),
    COALESCE(app.address, ''), CURRENT_DATE, 0, 'active')
  RETURNING id INTO new_student_id;

  UPDATE applications
  SET status = 'approved',
      student_id = new_student_id,
      reviewed_by = reviewer_id,
      reviewed_at = now(),
      updated_at = now()
  WHERE id = app_id;

  PERFORM log_audit_event(
    reviewer_id,
    'application.approved',
    'application',
    app_id,
    jsonb_build_object('status', app.status),
    jsonb_build_object('status', 'approved', 'student_id', new_student_id)
  );

  RETURN new_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_monthly_fees(billing_month TEXT, fee_amount NUMERIC)
RETURNS INT AS $$
DECLARE
  count INT := 0;
  student_rec RECORD;
  invoice_num TEXT;
BEGIN
  FOR student_rec IN SELECT * FROM students WHERE status = 'active' LOOP
    BEGIN
      invoice_num := 'INV-' || billing_month || '-' ||
        LPAD(nextval('invoice_number_seq')::TEXT, 4, '0');

      INSERT INTO fee_invoices (invoice_number, student_id, billing_month,
        fee_type, amount, due_date, status)
      VALUES (invoice_num, student_rec.id, billing_month, 'monthly',
        fee_amount, (billing_month || '-10')::DATE, 'unpaid');

      count := count + 1;
    EXCEPTION WHEN unique_violation THEN
      CONTINUE;
    END;
  END LOOP;
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 018: Seed Data
-- ============================================================

-- Seed subjects
INSERT INTO subjects (name, code, category, sort_order) VALUES
  ('Science', 'SCI', 'general', 1),
  ('Urdu', 'URD', 'language', 2),
  ('English', 'ENG', 'language', 3),
  ('Islamiat', 'ISL', 'religious', 4),
  ('Pakistan Studies', 'PST', 'social', 5),
  ('Computer', 'COM', 'technical', 6),
  ('Biology', 'BIO', 'science', 7),
  ('Physics', 'PHY', 'science', 8),
  ('Chemistry', 'CHE', 'science', 9),
  ('Mathematics', 'MAT', 'science', 10),
  ('Accounting', 'ACC', 'commerce', 11),
  ('Statistics', 'STA', 'commerce', 12),
  ('Economics', 'ECO', 'commerce', 13)
ON CONFLICT (code) DO NOTHING;

-- Seed classes
INSERT INTO classes (name, grade, section, academic_year, capacity) VALUES
  ('Class 6 - A', '6th', 'A', '2026', 30),
  ('Class 7 - A', '7th', 'A', '2026', 30),
  ('Class 8 - A', '8th', 'A', '2026', 30),
  ('Class 9 - A', '9th', 'A', '2026', 30),
  ('Class 9 - B', '9th', 'B', '2026', 30),
  ('Class 10 - A', '10th', 'A', '2026', 30),
  ('Class 10 - B', '10th', 'B', '2026', 30),
  ('FSc Pre-Eng 1st Year', 'FSc Pre-Engineering', 'A', '2026', 25),
  ('FSc Pre-Eng 2nd Year', 'FSc Pre-Engineering', 'B', '2026', 25),
  ('FSc Pre-Med 1st Year', 'FSc Pre-Medical', 'A', '2026', 25),
  ('FSc Pre-Med 2nd Year', 'FSc Pre-Medical', 'B', '2026', 25),
  ('ICS', 'ICS', 'A', '2026', 25),
  ('I.Com', 'I.Com', 'A', '2026', 25);

-- Seed website content
INSERT INTO website_content (key, value, published) VALUES
  ('hero', '{"title":"Premier Evening Coaching Academy","subtitle":"Trusted since 1998 in Islamabad","cta":"Apply for Admission"}', true),
  ('about', '{"title":"About Al-Mustafa Academy","description":"Quality evening coaching for Juniors, Matric and F.Sc students."}', true),
  ('contact', '{"phone":"0335 0555696","email":"almustafaschool@gmail.com","addressPrimary":"House# 1460 Sachal Sarmast Road, G-11/2, Islamabad","addressSecondary":"House 417, Sawan Road, G-10/4, Islamabad"}', true),
  ('social', '{"facebook":"https://www.facebook.com/Almustafa614","youtube":"https://youtube.com/@almustafa1292"}', true)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
