-- 009_create_fee_invoices_payments.sql
-- Fee invoices and payments tables

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
  received_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fee_invoices_student ON fee_invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_invoices_status ON fee_invoices(status);
CREATE INDEX IF NOT EXISTS idx_fee_invoices_billing_month ON fee_invoices(billing_month);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);

-- Sequence for invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1001;

-- Function to auto-generate invoice number
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

-- Function to update invoice status when payment is made
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

-- Enable RLS
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Admin can manage all fees
CREATE POLICY "Admin can manage fee_invoices"
  ON fee_invoices FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can manage payments"
  ON payments FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Students can read own invoices
CREATE POLICY "Students can read own invoices"
  ON fee_invoices FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid()));

-- Guardians can read linked student invoices
CREATE POLICY "Guardians can read linked invoices"
  ON fee_invoices FOR SELECT
  USING (student_id IN (
    SELECT sg.student_id FROM student_guardians sg
    JOIN guardians g ON g.id = sg.guardian_id
    WHERE g.auth_user_id = auth.uid()
  ));
