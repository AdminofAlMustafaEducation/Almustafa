import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type ChatAgent = {
  id: string;
  name: string;
  role: string;
  photo_url?: string;
  whatsapp_number: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const mockAgents: ChatAgent[] = [
  { id: "1", name: "Al-Mustafa Academy", role: "Admissions", photo_url: "/brand/almustafa-logo.jpg", whatsapp_number: "+923350555696", is_active: true, sort_order: 1, created_at: "2026-08-08T00:00:00Z", updated_at: "2026-08-08T00:00:00Z" },
];

const USE_MOCK = !supabase;

export function useChatAgents() {
  return useQuery({
    queryKey: ["chat-agents"],
    queryFn: async (): Promise<ChatAgent[]> => {
      if (USE_MOCK) {
        return [...mockAgents].sort((a, b) => a.sort_order - b.sort_order);
      }
      const { data, error } = await supabase!.from("chat_agents").select("*").order("sort_order");
      if (error) throw new Error(error.message);
      return (data ?? []) as ChatAgent[];
    },
  });
}

export function useActiveChatAgents() {
  return useQuery({
    queryKey: ["chat-agents", "active"],
    queryFn: async (): Promise<ChatAgent[]> => {
      if (USE_MOCK) {
        return mockAgents.filter((a) => a.is_active).sort((a, b) => a.sort_order - b.sort_order);
      }
      const { data, error } = await supabase!.from("chat_agents").select("*").eq("is_active", true).order("sort_order");
      if (error) throw new Error(error.message);
      return (data ?? []) as ChatAgent[];
    },
  });
}

export function useCreateChatAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agent: Omit<ChatAgent, "id" | "created_at" | "updated_at">): Promise<ChatAgent> => {
      if (USE_MOCK) {
        const newItem: ChatAgent = { ...agent, id: String(Date.now()), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        mockAgents.push(newItem);
        return newItem;
      }
      const { data, error } = await supabase!.from("chat_agents").insert(agent).select().single();
      if (error) throw new Error(error.message);
      return data as ChatAgent;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["chat-agents"] }),
  });
}

export function useUpdateChatAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ChatAgent> & { id: string }): Promise<ChatAgent> => {
      if (USE_MOCK) {
        const index = mockAgents.findIndex((a) => a.id === id);
        if (index === -1) throw new Error("Agent not found");
        mockAgents[index] = { ...mockAgents[index], ...updates, updated_at: new Date().toISOString() };
        return mockAgents[index];
      }
      const { data, error } = await supabase!.from("chat_agents").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data as ChatAgent;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["chat-agents"] }),
  });
}

export function useDeleteChatAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockAgents.findIndex((a) => a.id === id);
        if (index !== -1) mockAgents.splice(index, 1);
        return;
      }
      const { error } = await supabase!.from("chat_agents").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["chat-agents"] }),
  });
}
