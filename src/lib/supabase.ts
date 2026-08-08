import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables not set. Admin features will not work.",
  );
}

// Validate URL format
function isValidSupabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

const isConfigured = isValidSupabaseUrl(supabaseUrl) && !!supabaseAnonKey;

if (supabaseUrl && !isValidSupabaseUrl(supabaseUrl)) {
  console.error(
    `Invalid Supabase URL format: "${supabaseUrl}". Expected format: https://your-project.supabase.co`,
  );
}

export const supabase = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const supabaseConfigured = isConfigured;
