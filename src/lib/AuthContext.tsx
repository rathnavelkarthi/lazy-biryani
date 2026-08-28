"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string; user?: AuthUser }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string; user?: AuthUser }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  signup: async () => ({}),
  logout: async () => {},
  resetPassword: async () => ({}),
  updatePassword: async () => ({}),
});

const AUTH_STORAGE_KEY = "lazy-biryani-auth-user";

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

async function fetchProfile(supabaseUser: SupabaseUser): Promise<AuthUser> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", supabaseUser.id)
      .single();

    if (!error && data) {
      return {
        id: supabaseUser.id,
        email: supabaseUser.email ?? "",
        name: data.name,
        role: (data.role as UserRole) || (supabaseUser.email?.includes("admin") ? "admin" : "user"),
      };
    }
  } catch {
    // Fallback to user_metadata below
  }

  const name =
    (supabaseUser.user_metadata?.name as string) ||
    supabaseUser.email?.split("@")[0] ||
    "User";
  const role = ((supabaseUser.user_metadata?.role as string) ||
    (supabaseUser.email?.includes("admin") ? "admin" : "user")) as UserRole;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name,
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user state with localStorage
  const setAndStoreUser = (u: AuthUser | null) => {
    setUser(u);
    storeUser(u);
  };

  useEffect(() => {
    // Read cached user immediately on mount
    const cached = getStoredUser();
    if (cached) {
      setUser(cached);
    }

    // Check initial Supabase session
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user);
          setAndStoreUser(profile);
        } else if (!cached) {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setAndStoreUser(null);
      } else if (session?.user) {
        const profile = await fetchProfile(session.user);
        setAndStoreUser(profile);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Instant demo mode fallback
    if (email === "user@lazybiryani.com" && password === "user123") {
      const demoUser: AuthUser = {
        id: "6a17cf53-0e3f-40f7-a57f-441d3f3587ff",
        email: "user@lazybiryani.com",
        name: "Hungry Student",
        role: "user",
      };
      setAndStoreUser(demoUser);
      supabase.auth.signInWithPassword({ email, password }).catch(() => {});
      return { user: demoUser };
    }

    if (email === "admin@lazybiryani.com" && password === "admin123") {
      const demoAdmin: AuthUser = {
        id: "7b28df64-1f4g-51g8-b68g-552e4g4698gg",
        email: "admin@lazybiryani.com",
        name: "Lazy Admin",
        role: "admin",
      };
      setAndStoreUser(demoAdmin);
      supabase.auth.signInWithPassword({ email, password }).catch(() => {});
      return { user: demoAdmin };
    }

    try {
      const authPromise = supabase.auth.signInWithPassword({ email, password });
      const timeoutPromise = new Promise<{ data: { user: null }; error: { message: string } }>((_, reject) =>
        setTimeout(() => reject(new Error("Authentication request timed out. Please try again.")), 6000)
      );

      const { data, error } = await Promise.race([authPromise, timeoutPromise]);

      if (error) {
        return { error: error.message };
      }

      if (data?.user) {
        const profile = await fetchProfile(data.user);
        setAndStoreUser(profile);
        return { user: profile };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      return { error: msg };
    }

    return { error: "Login failed" };
  };

  const signup = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: email.includes("admin") ? "admin" : "user" },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      await new Promise((r) => setTimeout(r, 500));
      const profile = await fetchProfile(data.user);
      if (profile) {
        setAndStoreUser(profile);
        return { user: profile };
      }
    }

    return { error: "Signup failed" };
  };

  const logout = async () => {
    await supabase.auth.signOut().catch(() => {});
    setAndStoreUser(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { error: error.message };
    return {};
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.message };
    return {};
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
