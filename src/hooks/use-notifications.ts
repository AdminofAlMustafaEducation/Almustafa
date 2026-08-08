import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  is_read: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const mockNotifications: Notification[] = [
  { id: "1", title: "Juniors Admissions Open (Class 1-8)", message: "Admissions are now open for Junior classes (1-8). Build strong foundations with experienced teachers and small batches.", date: "2026-08-08", is_read: false, is_active: true, sort_order: 1, created_at: "2026-08-08T00:00:00Z", updated_at: "2026-08-08T00:00:00Z" },
  { id: "2", title: "Matric Admissions Open (9th & 10th)", message: "Registration is open for Matric 9th and 10th classes. FBISE-aligned coaching, weekly tests and concept-based preparation.", date: "2026-08-08", is_read: false, is_active: true, sort_order: 2, created_at: "2026-08-08T00:00:00Z", updated_at: "2026-08-08T00:00:00Z" },
  { id: "3", title: "Intermediate Admissions Open (11th & 12th)", message: "F.Sc Pre-Medical and Pre-Engineering admissions for 1st Year and 2nd Year are now open. Senior college lecturers and board-focused coaching.", date: "2026-08-08", is_read: false, is_active: true, sort_order: 3, created_at: "2026-08-08T00:00:00Z", updated_at: "2026-08-08T00:00:00Z" },
  { id: "4", title: "Evening Batches Starting Soon", message: "All evening batches for Juniors, Matric and F.Sc are starting soon. Classes run Monday to Saturday, 3:00 PM to 9:00 PM.", date: "2026-08-08", is_read: false, is_active: true, sort_order: 4, created_at: "2026-08-08T00:00:00Z", updated_at: "2026-08-08T00:00:00Z" },
];

const USE_MOCK = !supabase;

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<Notification[]> => {
      if (USE_MOCK) {
        return [...mockNotifications].sort((a, b) => a.sort_order - b.sort_order);
      }
      try {
        const { data, error } = await supabase!.from("notifications").select("*").order("sort_order");
        if (error) {
          if (error.message.includes("Could not find the table")) {
            console.warn("Notifications table not found, falling back to mock data");
            return [...mockNotifications];
          }
          throw new Error(error.message);
        }
        return (data ?? []) as Notification[];
      } catch (err) {
        if (err instanceof Error && err.message.includes("Could not find the table")) {
          console.warn("Notifications table not found, falling back to mock data");
          return [...mockNotifications];
        }
        throw err;
      }
    },
  });
}

export function useActiveNotifications() {
  return useQuery({
    queryKey: ["notifications", "active"],
    queryFn: async (): Promise<Notification[]> => {
      if (USE_MOCK) {
        return mockNotifications.filter((n) => n.is_active).sort((a, b) => a.sort_order - b.sort_order);
      }
      try {
        const { data, error } = await supabase!.from("notifications").select("*").eq("is_active", true).order("sort_order");
        if (error) {
          if (error.message.includes("Could not find the table")) {
            console.warn("Notifications table not found, falling back to mock data");
            return mockNotifications.filter((n) => n.is_active).sort((a, b) => a.sort_order - b.sort_order);
          }
          throw new Error(error.message);
        }
        return (data ?? []) as Notification[];
      } catch (err) {
        if (err instanceof Error && err.message.includes("Could not find the table")) {
          console.warn("Notifications table not found, falling back to mock data");
          return mockNotifications.filter((n) => n.is_active).sort((a, b) => a.sort_order - b.sort_order);
        }
        throw err;
      }
    },
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notif: Omit<Notification, "id" | "created_at" | "updated_at">): Promise<Notification> => {
      if (USE_MOCK) {
        const newItem: Notification = { ...notif, id: String(Date.now()), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        mockNotifications.push(newItem);
        return newItem;
      }
      const { data, error } = await supabase!.from("notifications").insert(notif).select().single();
      if (error) throw new Error(error.message);
      return data as Notification;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Notification> & { id: string }): Promise<Notification> => {
      if (USE_MOCK) {
        const index = mockNotifications.findIndex((n) => n.id === id);
        if (index === -1) throw new Error("Notification not found");
        mockNotifications[index] = { ...mockNotifications[index], ...updates, updated_at: new Date().toISOString() };
        return mockNotifications[index];
      }
      const { data, error } = await supabase!.from("notifications").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data as Notification;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockNotifications.findIndex((n) => n.id === id);
        if (index !== -1) mockNotifications.splice(index, 1);
        return;
      }
      const { error } = await supabase!.from("notifications").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
