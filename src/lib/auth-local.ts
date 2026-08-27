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

const USER_ROLES: UserRole[] = ["admin", "teacher", "student", "guardian"];

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole);
}

// Supabase Auth is the session authority; the active profile is the role authority.
async function getUserRole(
  userId: string,
  email: string,
): Promise<{ role: UserRole; name: string } | null> {
  if (!supabase) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, full_name, is_active")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (error || !profile || profile.is_active !== true || !isUserRole(profile.role)) {
    return null;
  }

  return {
    role: profile.role,
    name: profile.full_name || email.split("@")[0] || "User",
  };
}

export async function validateLogin(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  if (!supabaseConfigured || !supabase) {
    return {
      success: false,
      error: "Authentication service not configured.",
    };
  }

  try {
    console.log("[Auth] Attempting login for:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.error("[Auth] Login failed:", error?.message);
      return {
        success: false,
        error: error?.message || "Invalid email or password",
      };
    }

    console.log("[Auth] Login successful, user ID:", data.user.id);
    const resolvedRole = await getUserRole(data.user.id, data.user.email || email);
    if (!resolvedRole) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Account profile is missing or inactive.",
      };
    }

    const { role, name } = resolvedRole;
    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
      role,
      name,
      is_active: true,
      created_at: data.user.created_at,
      updated_at: data.user.updated_at || data.user.created_at,
    };

    console.log("[Auth] Final user object:", {
      email: user.email,
      role: user.role,
      name: user.name,
    });
    return { success: true, user };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Auth] Supabase auth error:", message);

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
  if (!supabase) return null;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return null;

    console.log("[Auth] Restoring session for:", session.user.email);

    // Get user role
    const resolvedRole = await getUserRole(session.user.id, session.user.email || "");
    if (!resolvedRole) return null;

    const { role, name } = resolvedRole;
    const user: User = {
      id: session.user.id,
      email: session.user.email || "",
      role,
      name,
      is_active: true,
      created_at: session.user.created_at,
      updated_at: session.user.updated_at || session.user.created_at,
    };

    console.log("[Auth] Session restored:", { email: user.email, role: user.role });
    storeUser(user);
    return user;
  } catch (err) {
    console.error("[Auth] Session fetch error:", err);
    return null;
  }
}
