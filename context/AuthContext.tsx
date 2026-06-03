"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { usersApi } from "@/lib/api";
import type { AuthSession, LoginInput, RegisterInput } from "@/types";

interface AuthContextValue {
  user: AuthSession | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = "eventcraft_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        setUser(JSON.parse(raw) as AuthSession);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async ({ email, password }: LoginInput) => {
      const matches = await usersApi.getByEmail(email);
      const found = matches.find((u) => u.password === password);

      if (!found) {
        throw new Error("Invalid email or password.");
      }

      const session: AuthSession = {
        id: found.id,
        firstName: found.firstName,
        lastName: found.lastName,
        email: found.email,
        role: found.role,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      router.push("/dashboard");
    },
    [router]
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const existing = await usersApi.getByEmail(input.email);
      if (existing.length > 0) {
        throw new Error("An account with this email already exists.");
      }

      const created = await usersApi.create(input);
      const session: AuthSession = {
        id: created.id,
        firstName: created.firstName,
        lastName: created.lastName,
        email: created.email,
        role: created.role,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
