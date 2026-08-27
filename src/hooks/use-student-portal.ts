import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export interface StudentProfile {
  id: string;
  auth_user_id?: string;
  full_name: string;
  name?: string;
  email?: string;
  phone?: string;
  roll_number?: string;
  grade?: string;
  class_level?: number;
  program?: string;
  campus?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  parent_name?: string;
  parent_phone?: string;
  guardian_name?: string;
  status: string;
  admission_date: string;
}

export interface StudentAttendance {
  id: string;
  student_id: string;
  class_id: string;
  subject_id: string;
  attendance_date: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

export interface StudentResult {
  id: string;
  exam_id: string;
  student_id: string;
  marks_obtained: number;
  total_marks: number;
  grade?: string;
  remarks?: string;
  test_name: string;
  subject: string;
  test_date: string;
}

export interface StudentFee {
  id: string;
  student_id: string;
  amount: number;
  fee_type: string;
  month?: string;
  billing_month: string;
  due_date?: string;
  status: string;
  invoice_number?: string;
}

export function useStudentProfile(userId?: string) {
  return useQuery({
    queryKey: ["student-profile", userId],
    queryFn: async (): Promise<StudentProfile | null> => {
      if (!supabase || !userId) return null;

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("auth_user_id", userId)
        .single();

      if (error) {
        console.error("Failed to load student profile:", error);
        return null;
      }

      // Map database fields to what the UI expects
      return {
        id: data.id,
        auth_user_id: data.auth_user_id,
        full_name: data.full_name,
        name: data.full_name, // alias for UI compatibility
        email: data.email,
        phone: data.phone,
        roll_number: data.roll_number,
        grade: data.grade,
        class_level: data.class_level,
        program: data.program,
        campus: data.campus,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        address: data.address,
        parent_name: data.parent_name || data.guardian_name,
        parent_phone: data.parent_phone,
        guardian_name: data.guardian_name,
        status: data.status,
        admission_date: data.admission_date,
      };
    },
    enabled: !!userId,
  });
}

export function useStudentAttendance(studentId: string, year: number, month: number) {
  return useQuery({
    queryKey: ["student-attendance", studentId, year, month],
    queryFn: async (): Promise<StudentAttendance[]> => {
      if (!supabase || !studentId) return [];

      // Build date range for the month
      const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const endDate = new Date(year, month + 1, 0);
      const endDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", studentId)
        .gte("attendance_date", startDate)
        .lte("attendance_date", endDateStr)
        .order("attendance_date", { ascending: true });

      if (error) {
        console.error("Failed to load attendance:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!studentId,
  });
}

export function useStudentResults(studentId: string) {
  return useQuery({
    queryKey: ["student-results", studentId],
    queryFn: async (): Promise<StudentResult[]> => {
      if (!supabase || !studentId) return [];

      const { data, error } = await supabase
        .from("exam_results")
        .select(
          `
          id,
          exam_id,
          student_id,
          marks_obtained,
          grade,
          remarks,
          exams!inner (
            name,
            total_marks,
            exam_date,
            subject_id,
            subjects (name)
          )
        `,
        )
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load exam results:", error);
        return [];
      }

      // Transform the joined data into the format the UI expects
      return (data || []).map((row) => {
        const exam = firstRelation(row.exams);
        const subject = firstRelation(exam?.subjects);
        return {
          id: row.id,
          exam_id: row.exam_id,
          student_id: row.student_id,
          marks_obtained: Number(row.marks_obtained),
          total_marks: exam?.total_marks || 100,
          grade: row.grade,
          remarks: row.remarks,
          test_name: exam?.name || "Unknown Exam",
          subject: subject?.name || "Unknown Subject",
          test_date: exam?.exam_date || "",
        };
      });
    },
    enabled: !!studentId,
  });
}

export function useStudentFees(studentId: string) {
  return useQuery({
    queryKey: ["student-fees", studentId],
    queryFn: async (): Promise<StudentFee[]> => {
      if (!supabase || !studentId) return [];

      const { data, error } = await supabase
        .from("fee_invoices")
        .select("*")
        .eq("student_id", studentId)
        .order("billing_month", { ascending: false });

      if (error) {
        console.error("Failed to load fee invoices:", error);
        return [];
      }

      // Map database fields to what the UI expects
      return (data || []).map((row) => ({
        id: row.id,
        student_id: row.student_id,
        amount: Number(row.amount),
        fee_type: row.fee_type,
        month: row.billing_month, // UI uses `month`
        billing_month: row.billing_month,
        due_date: row.due_date,
        status: row.status === "unpaid" ? "pending" : row.status, // normalize status
        invoice_number: row.invoice_number,
      }));
    },
    enabled: !!studentId,
  });
}
