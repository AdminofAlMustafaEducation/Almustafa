export type UserRole = "admin" | "teacher" | "student";

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

export interface Student {
  id: string;
  user_id?: string;
  roll_number?: string;
  name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  class_level: 9 | 10 | 11 | 12;
  program: "matric" | "fsc_pre_medical" | "fsc_pre_engineering";
  campus: "main" | "second";
  parent_name: string;
  parent_phone: string;
  parent_cnic?: string;
  photo_url?: string;
  admission_date: string;
  status: "active" | "inactive" | "graduated" | "withdrawn";
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  application_number: string;
  student_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  class_level: number;
  program: string;
  campus: string;
  previous_school?: string;
  previous_marks?: string;
  parent_name: string;
  parent_phone: string;
  parent_cnic?: string;
  photo_url?: string;
  documents: string[];
  status: "pending" | "reviewing" | "approved" | "rejected" | "enrolled";
  reviewer_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Faculty {
  id: string;
  user_id?: string;
  name: string;
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

export interface Attendance {
  id: string;
  student_id: string;
  batch_id: string;
  date: string;
  status: "present" | "absent" | "late";
  notes?: string;
  created_at: string;
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
