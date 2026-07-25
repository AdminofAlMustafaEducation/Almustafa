import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "@/hooks/use-auth";
import { getStoredUser, storeUser, validateLogin } from "@/lib/auth-local";
import type { User } from "@/types/database";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const result = validateLogin(email, password);
    if (!result.success) {
      throw new Error(result.error);
    }
    setUser(result.user);
    storeUser(result.user);
  }

  async function logout() {
    setUser(null);
    storeUser(null);
  }

  const value: AuthContextType = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
