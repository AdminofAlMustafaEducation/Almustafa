-- 019_extend_applications.sql
-- Add email, password, tracking_code to applications
-- Add email, password to students
-- Create approve_and_create_account RPC

-- Add columns to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS tracking_code TEXT;

-- Add columns to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS password TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_tracking_code ON applications(tracking_code);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

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
  -- Get and lock the application
  SELECT * INTO app FROM applications WHERE id = app_id FOR UPDATE;

  -- Validate status
  IF app.status NOT IN ('pending', 'under_review', 'reviewing') THEN
    RAISE EXCEPTION 'Cannot approve application with status: %', app.status;
  END IF;

  -- Check duplicate email
  IF app.email IS NOT NULL AND app.email != '' THEN
    IF EXISTS (SELECT 1 FROM students WHERE email = app.email) THEN
      RAISE EXCEPTION 'Student with email % already exists', app.email;
    END IF;
  END IF;

  -- Check duplicate identity
  IF app.identity_number IS NOT NULL AND app.identity_number != '' THEN
    IF EXISTS (SELECT 1 FROM students WHERE identity_number = app.identity_number) THEN
      RAISE EXCEPTION 'Student with identity number % already exists', app.identity_number;
    END IF;
  END IF;

  -- Generate student number
  new_student_number := 'STU-' || EXTRACT(YEAR FROM NOW()) || '-' ||
    LPAD(nextval('student_number_seq')::TEXT, 4, '0');

  -- Create student record
  INSERT INTO students (student_number, full_name, father_name, phone,
    identity_type, identity_number, gender, grade, address,
    admission_date, monthly_fee, status, email, password)
  VALUES (new_student_number, app.full_name, COALESCE(app.father_name, ''), app.phone,
    'b_form', app.identity_number, COALESCE(app.gender, 'male'),
    COALESCE(app.grade, '9th'), COALESCE(app.address, ''),
    CURRENT_DATE, 0, 'active', app.email, app.password)
  RETURNING id INTO new_student_id;

  -- Update application
  UPDATE applications
  SET status = 'approved',
      student_id = new_student_id,
      reviewed_by = reviewer_id,
      reviewed_at = now(),
      updated_at = now()
  WHERE id = app_id;

  -- Audit log
  INSERT INTO application_status_history
    (application_id, old_status, new_status, changed_by, reason)
  VALUES (app_id, app.status, 'approved', reviewer_id, 'Approved and student admitted');

  -- Return result
  result := jsonb_build_object(
    'student_id', new_student_id,
    'student_number', new_student_number,
    'application_number', app.application_number
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
