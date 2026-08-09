import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TeacherSubject } from "@/types/database";

const USE_MOCK = !supabase;

const mockAssignments: TeacherSubject[] = [
  { id: "1", teacher_id: "teacher-1", subject_id: "math", class_id: "class-9", academic_year: "2026", created_at: "2026-01-01T00:00:00Z" },
  { id: "2", teacher_id: "teacher-1", subject_id: "math", class_id: "class-10", academic_year: "2026", created_at: "2026-01-01T00:00:00Z" },
  { id: "3", teacher_id: "teacher-2", subject_id: "physics", class_id: "class-10", academic_year: "2026", created_at: "2026-01-01T00:00:00Z" },
];

export function useTeacherAssignments(filters?: { teacherId?: string; classId?: string }) {
  return useQuery({
    queryKey: ["teacher-assignments", filters],
    queryFn: async (): Promise<TeacherSubject[]> => {
      if (USE_MOCK) {
        let result = [...mockAssignments];
        if (filters?.teacherId) result = result.filter((a) => a.teacher_id === filters.teacherId);
        if (filters?.classId) result = result.filter((a) => a.class_id === filters.classId);
        return result;
      }

      let query = supabase!.from("teacher_subjects").select("*");
      if (filters?.teacherId) query = query.eq("teacher_id", filters.teacherId);
      if (filters?.classId) query = query.eq("class_id", filters.classId);

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data ?? []) as TeacherSubject[];
    },
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignment: Omit<TeacherSubject, "id" | "created_at">): Promise<TeacherSubject> => {
      if (USE_MOCK) {
        const newAssignment: TeacherSubject = {
          ...assignment,
          id: String(Date.now()),
          created_at: new Date().toISOString(),
        };
        mockAssignments.push(newAssignment);
        return newAssignment;
      }

      const { data, error } = await supabase!.from("teacher_subjects").insert(assignment).select().single();
      if (error) throw new Error(error.message);
      return data as TeacherSubject;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["teacher-assignments"] });
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockAssignments.findIndex((a) => a.id === id);
        if (index !== -1) mockAssignments.splice(index, 1);
        return;
      }

      const { error } = await supabase!.from("teacher_subjects").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["teacher-assignments"] });
    },
  });
}
