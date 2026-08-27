export type UserRole = "admin" | "teacher" | "student" | "guardian";

// Profile linked to Supabase Auth
export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  whatsapp?: string;
  photo?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// User (legacy - kept for backward compatibility)
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Student
export interface Student {
  id: string;
  student_number?: string;
  auth_user_id?: string;
  full_name: string;
  /** Legacy list/detail alias; prefer full_name in new code. */
  name?: string;
  father_name?: string;
  guardian_name?: string;
  date_of_birth?: string;
  gender?: "male" | "female";
  id_number?: string;
  identity_type?: string;
  identity_number?: string;
  student_whatsapp?: string;
  student_whatsapp_verified?: boolean;
  parent_whatsapp?: string;
  parent_whatsapp_verified?: boolean;
  grade?: string;
  class_id?: string;
  monthly_fee?: number;
  email?: string;
  phone?: string;
  address?: string;
  roll_number?: string;
  photo?: string;
  photo_url?: string;
  admission_date: string;
  status: "active" | "inactive" | "graduated" | "withdrawn";
  // Legacy fields (backward compatibility)
  class_level?: number;
  program?: "matric" | "fsc_pre_medical" | "fsc_pre_engineering";
  campus?: "main" | "second";
  parent_name?: string;
  parent_phone?: string;
  parent_cnic?: string;
  created_at: string;
  updated_at: string;
}

// Guardian
export interface Guardian {
  id: string;
  auth_user_id?: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  cnic?: string;
  relationship?: "father" | "mother" | "brother" | "sister" | "guardian" | "other";
  created_at: string;
  updated_at: string;
}

// Student-Guardian junction
export interface StudentGuardian {
  student_id: string;
  guardian_id: string;
  is_primary: boolean;
  created_at: string;
}

// Teacher
export interface Teacher {
  id: string;
  auth_user_id?: string;
  full_name: string;
  phone?: string;
  whatsapp?: string;
  photo?: string;
  subject?: string;
  designation?: string;
  bio?: string;
  campus?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Faculty (legacy - kept for backward compatibility)
export interface Faculty {
  id: string;
  user_id?: string;
  name: string;
  /** Legacy API alias used by older portal components. */
  full_name?: string;
  initials?: string;
  subject: string;
  designation?: string;
  bio?: string;
  photo_url?: string;
  campus?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Application
export interface Application {
  id: string;
  application_number: string;
  full_name: string;
  student_name?: string;
  father_name?: string;
  email?: string;
  phone: string;
  identity_type?: string;
  identity_number?: string;
  id_number?: string;
  gender?: "male" | "female";
  grade?: string;
  dob?: string;
  date_of_birth?: string;
  address?: string;
  previous_school?: string;
  previous_marks?: string;
  guardian_occupation?: string;
  message?: string;
  parent_name?: string;
  parent_phone?: string;
  parent_cnic?: string;
  photo_url?: string;
  documents?: string[];
  class_level?: number;
  program?: string;
  campus?: string;
  status:
    | "pending"
    | "under_review"
    | "reviewing"
    | "approved"
    | "rejected"
    | "enrolled"
    | "withdrawn";
  reviewer_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  student_id?: string;
  created_at: string;
  updated_at: string;
}

// Application Status History
export interface ApplicationStatusHistory {
  id: string;
  application_id: string;
  old_status?: string;
  new_status: string;
  changed_by?: string;
  changed_at: string;
  reason?: string;
}

// Class
export interface Class {
  id: string;
  name: string;
  grade: string;
  section?: string;
  academic_year: string;
  capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Subject
export interface Subject {
  id: string;
  name: string;
  code: string;
  category?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// Teacher Subject Assignment
export interface TeacherSubject {
  id: string;
  teacher_id: string;
  subject_id: string;
  class_id: string;
  academic_year: string;
  created_at: string;
}

// Class Student enrollment
export interface ClassStudent {
  class_id: string;
  student_id: string;
  academic_year: string;
  enrolled_at: string;
}

// Attendance
export interface Attendance {
  id: string;
  student_id: string;
  /** Canonical schema fields. */
  class_id?: string;
  subject_id?: string;
  teacher_id?: string;
  attendance_date?: string;
  /** Legacy attendance-hook aliases. */
  batch_id?: string;
  date?: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Exam
export interface Exam {
  id: string;
  name: string;
  subject_id?: string;
  class_id: string;
  teacher_id: string;
  exam_date: string;
  total_marks: number;
  status: "draft" | "open" | "completed" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

// Exam Result
export interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  marks_obtained: number;
  grade?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

// Fee Invoice
export interface FeeInvoice {
  id: string;
  invoice_number: string;
  student_id: string;
  billing_month: string;
  fee_type: "monthly" | "admission" | "exam" | "transport" | "other";
  amount: number;
  due_date?: string;
  status: "draft" | "unpaid" | "partial" | "paid" | "overdue" | "cancelled" | "waived";
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Payment
export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  paid_at: string;
  method?: "cash" | "bank" | "online" | "other";
  reference?: string;
  received_by?: string;
  notes?: string;
  created_at: string;
}

// Note (Teacher's study material)
export interface Note {
  id: string;
  teacher_id: string;
  subject_id: string;
  class_id: string;
  title: string;
  description?: string;
  file_path?: string;
  file_type?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Notification
export interface Notification {
  id: string;
  user_id?: string;
  type?: string;
  title: string;
  message: string;
  date?: string;
  is_read?: boolean;
  is_active?: boolean;
  sort_order?: number;
  reference_type?: string;
  reference_id?: string;
  created_at: string;
}

// Live Class
export interface LiveClass {
  id: string;
  title: string;
  subject_id?: string;
  class_id: string;
  teacher_id: string;
  start_time: string;
  end_time: string;
  meeting_url: string;
  status: "scheduled" | "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

// Gallery Item
export interface GalleryItem {
  id: string;
  title?: string;
  description?: string;
  storage_path: string;
  public_url?: string;
  category?: string;
  sort_order: number;
  is_published: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Website Content (CMS)
export interface WebsiteContent {
  id: string;
  key: string;
  value: Record<string, unknown>;
  published: boolean;
  updated_at: string;
  updated_by?: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Legacy types (kept for backward compatibility)
export interface Batch {
  id: string;
  name: string;
  class_level: number;
  program: string;
  campus: string;
  teacher_id?: string;
  schedule?: string;
  capacity: number;
  session: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: string;
  batch_id: string;
  name: string;
  subject: string;
  total_marks: number;
  test_date: string;
  created_at: string;
}

export interface TestResult {
  id: string;
  test_id: string;
  student_id: string;
  marks_obtained: number;
  remarks?: string;
  created_at: string;
}

export interface Fee {
  id: string;
  student_id: string;
  amount: number;
  fee_type: "monthly" | "admission" | "exam" | "other";
  month?: string;
  due_date: string;
  paid_date?: string;
  status: "pending" | "paid" | "overdue" | "waived";
  payment_method?: string;
  receipt_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "new" | "responded" | "closed";
  responded_at?: string;
  created_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
  updated_by?: string;
}

export interface ChatAgent {
  id: string;
  name: string;
  role: string;
  photo_url?: string;
  whatsapp_number: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
