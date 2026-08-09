import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "@/hooks/use-auth";
import { validateLogin, signOut, getCurrentSession, storeUser } from "@/lib/auth-local";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types/database";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const sessionUser = await getCurrentSession();
      setUser(sessionUser);
      setIsLoading(false);
    }

    initAuth();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const sessionUser = await getCurrentSession();
            setUser(sessionUser);
          } else {
            setUser(null);
            storeUser(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  async function login(email: string, password: string): Promise<User> {
    const result = await validateLogin(email, password);
    if (!result.success || !result.user) {
      throw new Error(result.error || "Login failed");
    }
    setUser(result.user);
    storeUser(result.user);
    return result.user;
  }

  async function logout() {
    await signOut();
    setUser(null);
  }

  const value: AuthContextType = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
