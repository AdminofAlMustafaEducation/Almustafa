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

// Helper to get user role from various sources
async function getUserRole(userId: string, email: string, userMetadata: Record<string, any>): Promise<{ role: UserRole; name: string }> {
  let role: UserRole = "student";
  let name = email?.split("@")[0] || "User";

  // 1. Try to load from profiles table
  try {
    const { data: profile, error } = await supabase!
      .from("profiles")
      .select("role, full_name")
      .eq("auth_user_id", userId)
      .single();

    if (!error && profile) {
      role = profile.role as UserRole;
      name = profile.full_name;
      console.log("Role loaded from profiles table:", role);
      return { role, name };
    }
  } catch (err) {
    console.warn("Failed to load profile:", err);
  }

  // 2. Try user metadata
  if (userMetadata?.role) {
    role = userMetadata.role as UserRole;
    name = userMetadata.name || email?.split("@")[0] || "User";
    console.log("Role loaded from user metadata:", role);
    return { role, name };
  }

  // 3. Default to student
  console.log("No role found, defaulting to student");
  return { role: "student", name };
}

export async function validateLogin(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  if (!supabaseConfigured || !supabase) {
    return {
      success: false,
      error: "Authentication service not configured.",
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message || "Invalid email or password",
      };
    }

    // Get user role
    const { role, name } = await getUserRole(
      data.user.id,
      data.user.email || email,
      data.user.user_metadata || {}
    );

    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
      role,
      name,
      is_active: true,
      created_at: data.user.created_at,
      updated_at: data.user.updated_at || data.user.created_at,
    };

    console.log("Login successful, user role:", role);
    return { success: true, user };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Supabase auth error:", message);

    if (message.includes("Failed to fetch") || message.includes("fetch")) {
      return {
        success: false,
        error: "Cannot connect to authentication server.",
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
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return null;

    // Get user role
    const { role, name } = await getUserRole(
      session.user.id,
      session.user.email || "",
      session.user.user_metadata || {}
    );

    const user: User = {
      id: session.user.id,
      email: session.user.email || "",
      role,
      name,
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
