import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Fee } from "@/types/database";

const mockFees: Fee[] = [
  { id: "1", student_id: "1", amount: 5000, fee_type: "monthly", month: "August 2026", due_date: "2026-08-10", status: "pending", created_at: "2026-08-01T00:00:00Z", updated_at: "2026-08-01T00:00:00Z" },
  { id: "2", student_id: "2", amount: 5000, fee_type: "monthly", month: "August 2026", due_date: "2026-08-10", paid_date: "2026-08-05", status: "paid", payment_method: "cash", receipt_number: "RCP-001", created_at: "2026-08-01T00:00:00Z", updated_at: "2026-08-05T00:00:00Z" },
  { id: "3", student_id: "3", amount: 6000, fee_type: "monthly", month: "August 2026", due_date: "2026-08-10", status: "overdue", created_at: "2026-08-01T00:00:00Z", updated_at: "2026-08-01T00:00:00Z" },
  { id: "4", student_id: "4", amount: 5000, fee_type: "monthly", month: "August 2026", due_date: "2026-08-10", paid_date: "2026-08-03", status: "paid", payment_method: "bank", receipt_number: "RCP-002", created_at: "2026-08-01T00:00:00Z", updated_at: "2026-08-03T00:00:00Z" },
  { id: "5", student_id: "1", amount: 2000, fee_type: "admission", due_date: "2026-04-01", paid_date: "2026-04-01", status: "paid", payment_method: "cash", receipt_number: "RCP-003", created_at: "2026-04-01T00:00:00Z", updated_at: "2026-04-01T00:00:00Z" },
];

const USE_MOCK = !supabase;

export function useFees(filters?: { status?: string; studentId?: string }) {
  return useQuery({
    queryKey: ["fees", filters],
    queryFn: async (): Promise<Fee[]> => {
      if (USE_MOCK) {
        let result = [...mockFees];
        if (filters?.status) result = result.filter((f) => f.status === filters.status);
        if (filters?.studentId) result = result.filter((f) => f.student_id === filters.studentId);
        return result;
      }
      try {
        let query = supabase!.from("fees").select("*").order("created_at", { ascending: false });
        if (filters?.status) query = query.eq("status", filters.status);
        if (filters?.studentId) query = query.eq("student_id", filters.studentId);
        const { data, error } = await query;
        if (error) {
          if (error.message.includes("Could not find the table")) {
            console.warn("Fees table not found, falling back to mock data");
            return [...mockFees];
          }
          throw new Error(error.message);
        }
        return (data ?? []) as Fee[];
      } catch (err) {
        if (err instanceof Error && err.message.includes("Could not find the table")) {
          console.warn("Fees table not found, falling back to mock data");
          return [...mockFees];
        }
        throw err;
      }
    },
  });
}

export function useUpdateFee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Fee> & { id: string }): Promise<Fee> => {
      if (USE_MOCK) {
        const index = mockFees.findIndex((f) => f.id === id);
        if (index === -1) throw new Error("Fee not found");
        mockFees[index] = { ...mockFees[index], ...updates, updated_at: new Date().toISOString() };
        return mockFees[index];
      }
      const { data, error } = await supabase!.from("fees").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data as Fee;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["fees"] }),
  });
}
