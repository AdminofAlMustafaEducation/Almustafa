import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { User, UserRole } from "@/types/database";

const STORAGE_KEY = "almustafa_auth_user";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export async function validateLogin(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  if (!supabaseConfigured || !supabase) {
    return {
      success: false,
      error: "Authentication service not configured. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables in Vercel."
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { success: false, error: error?.message || "Invalid email or password" };
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
      role: (data.user.user_metadata?.role as UserRole) || "admin",
      name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Admin",
      is_active: true,
      created_at: data.user.created_at,
      updated_at: data.user.updated_at || data.user.created_at,
    };

    return { success: true, user };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Supabase auth error:", message);

    if (message.includes("Failed to fetch") || message.includes("fetch")) {
      return {
        success: false,
        error: "Cannot connect to authentication server. Please verify your Supabase URL is correct and the project is active."
      };
    }

    return { success: false, error: `Connection error: ${message}` };
  }
}

export async function signOut(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
  storeUser(null);
}

export async function getCurrentSession(): Promise<User | null> {
  if (!supabase) return getStoredUser();

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return null;

    const user: User = {
      id: session.user.id,
      email: session.user.email || "",
      role: (session.user.user_metadata?.role as UserRole) || "admin",
      name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Admin",
      is_active: true,
      created_at: session.user.created_at,
      updated_at: session.user.updated_at || session.user.created_at,
    };

    storeUser(user);
    return user;
  } catch (err) {
    console.error("Session fetch error:", err);
    return getStoredUser();
  }
}
