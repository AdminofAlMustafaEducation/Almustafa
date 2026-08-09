-- 017_create_rpc_functions.sql
-- RPC functions for atomic operations

-- Atomic Approve & Admit function
CREATE OR REPLACE FUNCTION approve_application(app_id UUID, reviewer_id UUID)
RETURNS UUID AS $$
DECLARE
  app RECORD;
  new_student_id UUID;
  new_student_number TEXT;
BEGIN
  -- Lock the application row
  SELECT * INTO app FROM applications WHERE id = app_id FOR UPDATE;

  -- Validate status
  IF app.status NOT IN ('pending', 'under_review', 'reviewing') THEN
    RAISE EXCEPTION 'Cannot approve application with status: %', app.status;
  END IF;

  -- Check duplicate identity (if provided)
  IF app.identity_number IS NOT NULL AND app.identity_number != '' THEN
    IF EXISTS (SELECT 1 FROM students WHERE identity_number = app.identity_number) THEN
      RAISE EXCEPTION 'Student with identity number % already exists', app.identity_number;
    END IF;
  END IF;

  -- Generate student number
  new_student_number := 'STU-' || EXTRACT(YEAR FROM NOW()) || '-' ||
    LPAD(nextval('student_number_seq')::TEXT, 4, '0');

  -- Create student
  INSERT INTO students (student_number, full_name, father_name, phone,
    identity_type, identity_number, gender, grade, address,
    admission_date, monthly_fee, status)
  VALUES (new_student_number, app.full_name, COALESCE(app.father_name, ''), app.phone,
    COALESCE(app.identity_type, 'b_form'), app.identity_number,
    COALESCE(app.gender, 'male'), COALESCE(app.grade, '9th'),
    COALESCE(app.address, ''), CURRENT_DATE, 0, 'active')
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

-- Idempotent Monthly Fee Generation
CREATE OR REPLACE FUNCTION generate_monthly_fees(billing_month TEXT, fee_amount NUMERIC)
RETURNS INT AS $$
DECLARE
  count INT := 0;
  student_rec RECORD;
  invoice_num TEXT;
BEGIN
  FOR student_rec IN SELECT * FROM students WHERE status = 'active' LOOP
    -- Skip if invoice already exists (idempotent)
    BEGIN
      invoice_num := 'INV-' || billing_month || '-' ||
        LPAD(nextval('invoice_number_seq')::TEXT, 4, '0');

      INSERT INTO fee_invoices (invoice_number, student_id, billing_month,
        fee_type, amount, due_date, status)
      VALUES (invoice_num, student_rec.id, billing_month, 'monthly',
        fee_amount, (billing_month || '-10')::DATE, 'unpaid');

      count := count + 1;
    EXCEPTION WHEN unique_violation THEN
      -- Invoice already exists for this student+month+type, skip
      CONTINUE;
    END;
  END LOOP;

  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
