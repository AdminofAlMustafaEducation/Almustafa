import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { LiveClass } from "@/types/database";

const USE_MOCK = !supabase;

const mockLiveClasses: LiveClass[] = [
  {
    id: "1",
    title: "Mathematics - Grade 9",
    subject_id: "math",
    class_id: "9th",
    teacher_id: "teacher-1",
    start_time: "2026-08-10T17:00:00Z",
    end_time: "2026-08-10T18:00:00Z",
    meeting_url: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
    created_at: "2026-08-08T10:00:00Z",
    updated_at: "2026-08-08T10:00:00Z",
  },
  {
    id: "2",
    title: "Physics - FSc Pre-Engineering",
    subject_id: "physics",
    class_id: "FSc Pre-Engineering",
    teacher_id: "teacher-2",
    start_time: "2026-08-11T16:00:00Z",
    end_time: "2026-08-11T17:30:00Z",
    meeting_url: "https://meet.google.com/xyz-uvwx-yz",
    status: "scheduled",
    created_at: "2026-08-08T11:00:00Z",
    updated_at: "2026-08-08T11:00:00Z",
  },
];

export const liveClassKeys = {
  all: ["live-classes"] as const,
  lists: () => [...liveClassKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...liveClassKeys.lists(), filters] as const,
};

export function useLiveClasses(filters?: { classId?: string; teacherId?: string; status?: string }) {
  return useQuery({
    queryKey: liveClassKeys.list(filters),
    queryFn: async (): Promise<LiveClass[]> => {
      if (USE_MOCK) {
        let result = [...mockLiveClasses];
        if (filters?.classId) result = result.filter((lc) => lc.class_id === filters.classId);
        if (filters?.teacherId) result = result.filter((lc) => lc.teacher_id === filters.teacherId);
        if (filters?.status) result = result.filter((lc) => lc.status === filters.status);
        return result.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
      }

      try {
        let query = supabase!.from("live_classes").select("*").order("start_time");
        if (filters?.classId) query = query.eq("class_id", filters.classId);
        if (filters?.teacherId) query = query.eq("teacher_id", filters.teacherId);
        if (filters?.status) query = query.eq("status", filters.status);

        const { data, error } = await query;
        if (error) {
          if (error.message.includes("Could not find the table")) {
            console.warn("live_classes table not found, falling back to mock data");
            return [...mockLiveClasses];
          }
          throw new Error(error.message);
        }
        return (data ?? []) as LiveClass[];
      } catch (err) {
        if (err instanceof Error && err.message.includes("Could not find the table")) {
          return [...mockLiveClasses];
        }
        throw err;
      }
    },
  });
}

export function useCreateLiveClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (liveClass: Omit<LiveClass, "id" | "created_at" | "updated_at">): Promise<LiveClass> => {
      if (USE_MOCK) {
        const newClass: LiveClass = {
          ...liveClass,
          id: String(Date.now()),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockLiveClasses.push(newClass);
        return newClass;
      }

      try {
        const { data, error } = await supabase!.from("live_classes").insert(liveClass).select().single();
        if (error) {
          if (error.message.includes("Could not find the table")) {
            const newClass: LiveClass = {
              ...liveClass,
              id: String(Date.now()),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            mockLiveClasses.push(newClass);
            return newClass;
          }
          throw new Error(error.message);
        }
        return data as LiveClass;
      } catch (err) {
        if (err instanceof Error && err.message.includes("Could not find the table")) {
          const newClass: LiveClass = {
            ...liveClass,
            id: String(Date.now()),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          mockLiveClasses.push(newClass);
          return newClass;
        }
        throw err;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: liveClassKeys.all });
    },
  });
}

export function useUpdateLiveClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LiveClass> & { id: string }): Promise<LiveClass> => {
      if (USE_MOCK) {
        const index = mockLiveClasses.findIndex((lc) => lc.id === id);
        if (index === -1) throw new Error("Live class not found");
        mockLiveClasses[index] = { ...mockLiveClasses[index], ...updates, updated_at: new Date().toISOString() };
        return mockLiveClasses[index];
      }

      try {
        const { data, error } = await supabase!.from("live_classes")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();
        if (error) {
          if (error.message.includes("Could not find the table")) {
            const index = mockLiveClasses.findIndex((lc) => lc.id === id);
            if (index === -1) throw new Error("Live class not found");
            mockLiveClasses[index] = { ...mockLiveClasses[index], ...updates, updated_at: new Date().toISOString() };
            return mockLiveClasses[index];
          }
          throw new Error(error.message);
        }
        return data as LiveClass;
      } catch (err) {
        if (err instanceof Error && err.message.includes("Could not find the table")) {
          const index = mockLiveClasses.findIndex((lc) => lc.id === id);
          if (index === -1) throw new Error("Live class not found");
          mockLiveClasses[index] = { ...mockLiveClasses[index], ...updates, updated_at: new Date().toISOString() };
          return mockLiveClasses[index];
        }
        throw err;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: liveClassKeys.all });
    },
  });
}

export function useDeleteLiveClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockLiveClasses.findIndex((lc) => lc.id === id);
        if (index !== -1) mockLiveClasses.splice(index, 1);
        return;
      }

      try {
        const { error } = await supabase!.from("live_classes").delete().eq("id", id);
        if (error) {
          if (error.message.includes("Could not find the table")) {
            const index = mockLiveClasses.findIndex((lc) => lc.id === id);
            if (index !== -1) mockLiveClasses.splice(index, 1);
            return;
          }
          throw new Error(error.message);
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("Could not find the table")) {
          const index = mockLiveClasses.findIndex((lc) => lc.id === id);
          if (index !== -1) mockLiveClasses.splice(index, 1);
          return;
        }
        throw err;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: liveClassKeys.all });
    },
  });
}
