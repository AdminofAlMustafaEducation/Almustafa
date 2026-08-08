import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Inquiry } from "@/types/database";

const mockInquiries: Inquiry[] = [
  { id: "1", name: "Ahmed Raza", email: "ahmed@example.com", phone: "0300-1234567", subject: "Admission inquiry for 9th class", message: "I want to admit my son in 9th class. What is the fee structure?", status: "new", created_at: "2026-08-07T10:00:00Z" },
  { id: "2", name: "Fatima Bibi", phone: "0301-2345678", subject: "F.Sc admission", message: "Is admission open for F.Sc Pre-Medical 1st year?", status: "new", created_at: "2026-08-06T14:30:00Z" },
  { id: "3", name: "Usman Ali", email: "usman@example.com", phone: "0302-3456789", subject: "Fee details", message: "What is the monthly fee for Matric class?", status: "responded", responded_at: "2026-08-05T09:00:00Z", created_at: "2026-08-04T16:00:00Z" },
  { id: "4", name: "Ayesha Khan", phone: "0303-4567890", subject: "Junior classes", message: "Do you have classes for grade 3 students?", status: "responded", responded_at: "2026-08-03T11:00:00Z", created_at: "2026-08-02T08:00:00Z" },
  { id: "5", name: "Tariq Mehmood", email: "tariq@example.com", phone: "0304-5678901", subject: "Campus visit", message: "Can I visit the campus before admission?", status: "closed", created_at: "2026-08-01T12:00:00Z" },
];

const USE_MOCK = !supabase;

export function useInquiries(filters?: { status?: string }) {
  return useQuery({
    queryKey: ["inquiries", filters],
    queryFn: async (): Promise<Inquiry[]> => {
      if (USE_MOCK) {
        let result = [...mockInquiries];
        if (filters?.status) result = result.filter((i) => i.status === filters.status);
        return result;
      }
      let query = supabase!.from("inquiries").select("*").order("created_at", { ascending: false });
      if (filters?.status) query = query.eq("status", filters.status);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data ?? []) as Inquiry[];
    },
  });
}

export function useUpdateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Inquiry> & { id: string }): Promise<Inquiry> => {
      if (USE_MOCK) {
        const index = mockInquiries.findIndex((i) => i.id === id);
        if (index === -1) throw new Error("Inquiry not found");
        mockInquiries[index] = { ...mockInquiries[index], ...updates };
        return mockInquiries[index];
      }
      const { data, error } = await supabase!.from("inquiries").update(updates).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data as Inquiry;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}
