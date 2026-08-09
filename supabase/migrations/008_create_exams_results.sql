-- 008_create_exams_results.sql
-- Exams and exam results tables

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exams_class ON exams(class_id);
CREATE INDEX IF NOT EXISTS idx_exams_subject ON exams(subject_id);
CREATE INDEX IF NOT EXISTS idx_exams_teacher ON exams(teacher_id);
CREATE INDEX IF NOT EXISTS idx_exams_date ON exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_exam_results_exam ON exam_results(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_student ON exam_results(student_id);

-- Grade calculation function
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

-- Trigger to auto-calculate grade
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

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Admin can manage all exams
CREATE POLICY "Admin can manage exams"
  ON exams FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Admin can manage all results
CREATE POLICY "Admin can manage exam_results"
  ON exam_results FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Teachers can manage exams for assigned classes
CREATE POLICY "Teachers can manage assigned exams"
  ON exams FOR ALL
  USING (teacher_id IN (SELECT id FROM teachers WHERE auth_user_id = auth.uid()));

-- Teachers can manage results for their exams
CREATE POLICY "Teachers can manage assigned results"
  ON exam_results FOR ALL
  USING (exam_id IN (
    SELECT id FROM exams WHERE teacher_id IN (
      SELECT id FROM teachers WHERE auth_user_id = auth.uid()
    )
  ));

-- Students can read own results
CREATE POLICY "Students can read own results"
  ON exam_results FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE auth_user_id = auth.uid()));

-- Guardians can read linked student results
CREATE POLICY "Guardians can read linked results"
  ON exam_results FOR SELECT
  USING (student_id IN (
    SELECT sg.student_id FROM student_guardians sg
    JOIN guardians g ON g.id = sg.guardian_id
    WHERE g.auth_user_id = auth.uid()
  ));
