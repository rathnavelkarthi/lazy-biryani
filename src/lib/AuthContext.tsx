"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type UserRole, findUser } from "./users";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string; user?: AuthUser }>;
  logout: () => Promise<void>;
}

const AUTH_KEY = "lazy-biryani-auth";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore corrupt storage
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const found = findUser(email, password);
    if (!found) {
      return { error: "Invalid email or password" };
    }
    setUser(found as AuthUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(found));
    return { user: found as AuthUser };
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
