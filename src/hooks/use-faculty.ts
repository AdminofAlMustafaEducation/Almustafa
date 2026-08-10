import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Faculty } from "@/types/database";

const mockFaculty: Faculty[] = [
  { id: "1", name: "Syed Ali Azeem Kazmi", subject: "Mathematics", designation: "Director Academy", initials: "AA", photo_url: "/faculty/syed-ali-azeem-kazmi.jpg", campus: "main", is_active: true, sort_order: 1, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "2", name: "Syed Ali Abbas Kazmi", subject: "Mathematics", designation: "Director Academy", initials: "AB", photo_url: "/faculty/syed-ali-abbas-kazmi.jpg", campus: "main", is_active: true, sort_order: 2, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "3", name: "Syed Sajid Kazmi", subject: "Biology", designation: "V.P ICB G-6/3", initials: "SK", campus: "second", is_active: true, sort_order: 3, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "4", name: "Ch. Muhammad Zareef", subject: "Coordinator", designation: "IMCB G-10/4", initials: "MZ", photo_url: "/faculty/ch-muhammad-zareef.jpg", campus: "main", is_active: true, sort_order: 4, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "5", name: "Nabeel Kanwar", subject: "Physics", designation: "Lecturer IMCB H-9", initials: "NK", photo_url: "/faculty/nabeel-kanwar.jpg", campus: "main", is_active: true, sort_order: 5, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "6", name: "Zahid Abbas Hiraj", subject: "Admin Accounts", designation: "Bahria College", initials: "ZH", photo_url: "/faculty/zahid-abbas-hiraj.jpg", campus: "second", is_active: true, sort_order: 6, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "7", name: "Syed Assad Abbas", subject: "Chemistry", designation: "Lecturer IMCB G-11/1", initials: "AA", photo_url: "/faculty/syed-assad-abbas.jpg", campus: "main", is_active: true, sort_order: 7, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "8", name: "Mr. Sajid", subject: "Chemistry", designation: "Lecturer IMCB H-9", initials: "MS", campus: "main", is_active: true, sort_order: 8, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "9", name: "Amir Abbasi", subject: "English", designation: "Lecturer APS RWP", initials: "AA", campus: "second", is_active: true, sort_order: 9, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "10", name: "Abbas Malik", subject: "Computer", designation: "Lecturer Al-Kausar", initials: "AM", campus: "main", is_active: true, sort_order: 10, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "11", name: "Zaheer Malik", subject: "Accounting", designation: "Account Officer PAF", initials: "ZM", campus: "second", is_active: false, sort_order: 11, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
];

const USE_MOCK = !supabase;

export function useFaculty(filters?: { campus?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ["faculty", filters],
    queryFn: async (): Promise<Faculty[]> => {
      if (USE_MOCK) {
        let result = [...mockFaculty];
        if (filters?.campus) result = result.filter((f) => f.campus === filters.campus);
        if (filters?.isActive !== undefined) result = result.filter((f) => f.is_active === filters.isActive);
        return result.sort((a, b) => a.sort_order - b.sort_order);
      }

      try {
        let query = supabase!.from("teachers").select("*").order("sort_order");
        if (filters?.campus) query = query.eq("campus", filters.campus);
        if (filters?.isActive !== undefined) query = query.eq("is_active", filters.isActive);

        const { data, error } = await query;
        if (error) {
          if (error.message.includes("Could not find the table")) {
            console.warn("Faculty table not found, falling back to mock data");
            let result = [...mockFaculty];
            if (filters?.campus) result = result.filter((f) => f.campus === filters.campus);
            if (filters?.isActive !== undefined) result = result.filter((f) => f.is_active === filters.isActive);
            return result.sort((a, b) => a.sort_order - b.sort_order);
          }
          throw new Error(error.message);
        }
        return (data ?? []) as Faculty[];
      } catch (err) {
        if (err instanceof Error && err.message.includes("Could not find the table")) {
          console.warn("Faculty table not found, falling back to mock data");
          return [...mockFaculty];
        }
        throw err;
      }
    },
  });
}

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (faculty: Omit<Faculty, "id" | "created_at" | "updated_at">): Promise<Faculty> => {
      if (USE_MOCK) {
        const newItem: Faculty = { ...faculty, id: String(Date.now()), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        mockFaculty.push(newItem);
        return newItem;
      }
      const { data, error } = await supabase!.from("faculty").insert(faculty).select().single();
      if (error) throw new Error(error.message);
      return data as Faculty;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["faculty"] }),
  });
}

export function useUpdateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Faculty> & { id: string }): Promise<Faculty> => {
      if (USE_MOCK) {
        const index = mockFaculty.findIndex((f) => f.id === id);
        if (index === -1) throw new Error("Faculty not found");
        mockFaculty[index] = { ...mockFaculty[index], ...updates, updated_at: new Date().toISOString() };
        return mockFaculty[index];
      }
      const { data, error } = await supabase!.from("faculty").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data as Faculty;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["faculty"] }),
  });
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockFaculty.findIndex((f) => f.id === id);
        if (index !== -1) mockFaculty.splice(index, 1);
        return;
      }
      const { error } = await supabase!.from("faculty").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["faculty"] }),
  });
}
