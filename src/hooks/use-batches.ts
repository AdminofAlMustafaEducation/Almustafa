import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Batch } from "@/types/database";

const mockBatches: Batch[] = [
  { id: "1", name: "Matric 9th - A", class_level: 9, program: "matric", campus: "main", capacity: 30, session: "2026-27", is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "2", name: "Matric 10th - A", class_level: 10, program: "matric", campus: "main", capacity: 25, session: "2026-27", is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "3", name: "F.Sc 1st Year - Pre-Medical", class_level: 11, program: "fsc_pre_medical", campus: "main", capacity: 20, session: "2026-27", is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "4", name: "F.Sc 2nd Year - Pre-Medical", class_level: 12, program: "fsc_pre_medical", campus: "main", capacity: 20, session: "2026-27", is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "5", name: "F.Sc 1st Year - Pre-Engineering", class_level: 11, program: "fsc_pre_engineering", campus: "second", capacity: 20, session: "2026-27", is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "6", name: "Juniors (1-8)", class_level: 1, program: "juniors", campus: "main", capacity: 35, session: "2026-27", is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "7", name: "Matric 9th - B", class_level: 9, program: "matric", campus: "second", capacity: 30, session: "2026-27", is_active: false, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
];

const USE_MOCK = import.meta.env.DEV && !supabase;

export function useBatches(filters?: { session?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ["batches", filters],
    queryFn: async (): Promise<Batch[]> => {
      if (USE_MOCK) {
        let result = [...mockBatches];
        if (filters?.session) result = result.filter((b) => b.session === filters.session);
        if (filters?.isActive !== undefined) result = result.filter((b) => b.is_active === filters.isActive);
        return result;
      }
      try {
        let query = supabase!.from("batches").select("*").order("created_at", { ascending: false });
        if (filters?.session) query = query.eq("session", filters.session);
        if (filters?.isActive !== undefined) query = query.eq("is_active", filters.isActive);
        const { data, error } = await query;
        if (error) {
          if (USE_MOCK && error.message.includes("Could not find the table")) {
            console.warn("Batches table not found, falling back to mock data");
            return [...mockBatches];
          }
          throw new Error(error.message);
        }
        return (data ?? []) as Batch[];
      } catch (err) {
        if (USE_MOCK && err instanceof Error && err.message.includes("Could not find the table")) {
          console.warn("Batches table not found, falling back to mock data");
          return [...mockBatches];
        }
        throw err;
      }
    },
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (batch: Omit<Batch, "id" | "created_at" | "updated_at">): Promise<Batch> => {
      if (USE_MOCK) {
        const newItem: Batch = { ...batch, id: String(Date.now()), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        mockBatches.push(newItem);
        return newItem;
      }
      const { data, error } = await supabase!.from("batches").insert(batch).select().single();
      if (error) throw new Error(error.message);
      return data as Batch;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["batches"] }),
  });
}

export function useUpdateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Batch> & { id: string }): Promise<Batch> => {
      if (USE_MOCK) {
        const index = mockBatches.findIndex((b) => b.id === id);
        if (index === -1) throw new Error("Batch not found");
        mockBatches[index] = { ...mockBatches[index], ...updates, updated_at: new Date().toISOString() };
        return mockBatches[index];
      }
      const { data, error } = await supabase!.from("batches").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data as Batch;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["batches"] }),
  });
}

export function useDeleteBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockBatches.findIndex((b) => b.id === id);
        if (index !== -1) mockBatches.splice(index, 1);
        return;
      }
      const { error } = await supabase!.from("batches").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["batches"] }),
  });
}
