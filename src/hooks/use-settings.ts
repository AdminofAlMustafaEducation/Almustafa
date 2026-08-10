import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
  updated_by?: string;
};

const defaultSettings: Record<string, unknown> = {
  name: "Al-Mustafa Academy",
  tagline: "Evening Coaching",
  phone: "0335 0555696",
  phoneIntl: "+923350555696",
  email: "almustafaschool@gmail.com",
  addressPrimary: "House# 1460 Sachal Sarmast Road, G-11/2, Islamabad",
  addressSecondary: "House 417, Sawan Road, G-10/4, Islamabad",
  city: "Islamabad, Pakistan 44000",
  facebook: "https://www.facebook.com/Almustafa614",
  youtube: "https://youtube.com/@almustafa1292",
};

const USE_MOCK = !supabase;

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async (): Promise<Record<string, unknown>> => {
      if (USE_MOCK) {
        return { ...defaultSettings };
      }
      const { data, error } = await supabase!.from("website_content").select("*").eq("key", "site_settings").single();
      if (error && error.code !== "PGRST116") throw new Error(error.message);
      return data?.value || { ...defaultSettings };
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Record<string, unknown>): Promise<void> => {
      if (USE_MOCK) {
        Object.assign(defaultSettings, settings);
        return;
      }
      const { error } = await supabase!.from("website_content").upsert({
        key: "site_settings",
        value: settings,
        updated_at: new Date().toISOString(),
      }, { onConflict: "key" });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });
}
