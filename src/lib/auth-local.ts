const STORAGE_KEY = "almustafa_auth_user";

const ADMIN_USER = {
  id: "admin-001",
  email: "almustafaeducationsystem408@gmail.com",
  name: "Admin",
  role: "admin" as const,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const ADMIN_PASSWORD = "AlMustafa@2026";

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: typeof ADMIN_USER | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function validateLogin(email: string, password: string) {
  if (email === ADMIN_USER.email && password === ADMIN_PASSWORD) {
    return { success: true, user: ADMIN_USER };
  }
  return { success: false, error: "Invalid email or password" };
}
