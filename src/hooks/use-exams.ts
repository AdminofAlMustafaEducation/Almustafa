import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Exam, ExamResult } from "@/types/database";

const USE_MOCK = import.meta.env.DEV && !supabase;

// Mock data
const mockExams: Exam[] = [
  {
    id: "1",
    name: "Weekly Test 1",
    subject_id: "math",
    class_id: "class-9",
    teacher_id: "teacher-1",
    exam_date: "2026-08-10",
    total_marks: 100,
    status: "published",
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Mid Term Exam",
    subject_id: "physics",
    class_id: "class-10",
    teacher_id: "teacher-2",
    exam_date: "2026-08-15",
    total_marks: 50,
    status: "open",
    created_at: "2026-08-05T00:00:00Z",
    updated_at: "2026-08-05T00:00:00Z",
  },
];

const mockResults: ExamResult[] = [
  { id: "1", exam_id: "1", student_id: "1", marks_obtained: 85, grade: "A", created_at: "2026-08-10T00:00:00Z", updated_at: "2026-08-10T00:00:00Z" },
  { id: "2", exam_id: "1", student_id: "2", marks_obtained: 72, grade: "B", created_at: "2026-08-10T00:00:00Z", updated_at: "2026-08-10T00:00:00Z" },
  { id: "3", exam_id: "1", student_id: "3", marks_obtained: 91, grade: "A+", created_at: "2026-08-10T00:00:00Z", updated_at: "2026-08-10T00:00:00Z" },
];

// Query keys
export const examKeys = {
  all: ["exams"] as const,
  lists: () => [...examKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...examKeys.lists(), filters] as const,
  details: () => [...examKeys.all, "detail"] as const,
  detail: (id: string) => [...examKeys.details(), id] as const,
  results: (examId: string) => [...examKeys.all, "results", examId] as const,
};

// Hooks
export function useExams(filters?: { classId?: string; status?: string }) {
  return useQuery({
    queryKey: examKeys.list(filters),
    queryFn: async (): Promise<Exam[]> => {
      if (USE_MOCK) {
        let result = [...mockExams];
        if (filters?.classId) result = result.filter((e) => e.class_id === filters.classId);
        if (filters?.status) result = result.filter((e) => e.status === filters.status);
        return result;
      }

      let query = supabase!.from("exams").select("*").order("exam_date", { ascending: false });
      if (filters?.classId) query = query.eq("class_id", filters.classId);
      if (filters?.status) query = query.eq("status", filters.status);

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data ?? []) as Exam[];
    },
  });
}

export function useExam(id: string) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: async (): Promise<Exam | null> => {
      if (USE_MOCK) {
        return mockExams.find((e) => e.id === id) ?? null;
      }

      const { data, error } = await supabase!.from("exams").select("*").eq("id", id).single();
      if (error) throw new Error(error.message);
      return data as Exam;
    },
    enabled: !!id,
  });
}

export function useExamResults(examId: string) {
  return useQuery({
    queryKey: examKeys.results(examId),
    queryFn: async (): Promise<ExamResult[]> => {
      if (USE_MOCK) {
        return mockResults.filter((r) => r.exam_id === examId);
      }

      const { data, error } = await supabase!.from("exam_results").select("*").eq("exam_id", examId);
      if (error) throw new Error(error.message);
      return (data ?? []) as ExamResult[];
    },
    enabled: !!examId,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exam: Omit<Exam, "id" | "created_at" | "updated_at">): Promise<Exam> => {
      if (USE_MOCK) {
        const newExam: Exam = {
          ...exam,
          id: String(Date.now()),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockExams.push(newExam);
        return newExam;
      }

      const { data, error } = await supabase!.from("exams").insert(exam).select().single();
      if (error) throw new Error(error.message);
      return data as Exam;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
  });
}

export function useSaveExamResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      results: { exam_id: string; student_id: string; marks_obtained: number; remarks?: string }[]
    ): Promise<ExamResult[]> => {
      if (USE_MOCK) {
        const saved: ExamResult[] = results.map((r) => {
          const existing = mockResults.find(
            (mr) => mr.exam_id === r.exam_id && mr.student_id === r.student_id
          );
          if (existing) {
            existing.marks_obtained = r.marks_obtained;
            existing.remarks = r.remarks;
            existing.updated_at = new Date().toISOString();
            return existing;
          }
          const newResult: ExamResult = {
            id: String(Date.now() + Math.random()),
            ...r,
            grade: calculateGrade(r.marks_obtained, 100),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          mockResults.push(newResult);
          return newResult;
        });
        return saved;
      }

      // Upsert results
      const { data, error } = await supabase!.from("exam_results").upsert(
        results.map((r) => ({
          exam_id: r.exam_id,
          student_id: r.student_id,
          marks_obtained: r.marks_obtained,
          remarks: r.remarks,
        })),
        { onConflict: "exam_id,student_id" }
      ).select();

      if (error) throw new Error(error.message);
      return (data ?? []) as ExamResult[];
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: examKeys.all });
      if (variables.length > 0) {
        void queryClient.invalidateQueries({
          queryKey: examKeys.results(variables[0].exam_id),
        });
      }
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockExams.findIndex((e) => e.id === id);
        if (index !== -1) mockExams.splice(index, 1);
        return;
      }

      const { error } = await supabase!.from("exams").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
  });
}

// Helper function for grade calculation
function calculateGrade(marks: number, totalMarks: number): string {
  if (totalMarks <= 0) return "-";
  const percentage = (marks / totalMarks) * 100;
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}
