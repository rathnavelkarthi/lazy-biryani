"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { BrutalistButton } from "@/components/ui/BrutalistButton";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/menu");
    }
  };

  const fillDemo = (type: "admin" | "user") => {
    if (type === "admin") {
      setEmail("admin@lazybiryani.com");
      setPassword("admin123");
    } else {
      setEmail("user@lazybiryani.com");
      setPassword("user123");
    }
    setError("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 diagonal-stripes">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="bg-secondary text-white w-10 h-10 flex items-center justify-center text-xl font-black">
              L
            </span>
            <span className="text-2xl font-black text-primary tracking-tighter font-[family-name:var(--font-plus-jakarta-sans)]">
              Lazy Biryani
            </span>
          </a>
        </div>

        {/* Login card */}
        <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 sm:p-8">
          <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-2xl sm:text-3xl font-black text-on-surface tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-on-surface-variant text-sm mb-6">
            Sign in to order or manage the shop.
          </p>

          {/* Demo credential buttons */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => fillDemo("user")}
              className="flex-1 bg-tertiary-container text-on-tertiary-container border-2 border-[#333333] px-3 py-2 text-xs font-black uppercase tracking-wider hover:brightness-95 transition-all"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="flex-1 bg-primary-container text-on-primary-container border-2 border-[#333333] px-3 py-2 text-xs font-black uppercase tracking-wider hover:brightness-95 transition-all"
            >
              Demo Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-surface border-4 border-[#333333] px-4 py-3 text-base font-bold focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-surface border-4 border-[#333333] px-4 py-3 text-base font-bold focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container border-2 border-error px-4 py-2 text-sm font-bold">
                {error}
              </div>
            )}

            <BrutalistButton
              variant="danger"
              size="md"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </BrutalistButton>
          </form>

          {/* Demo credentials info */}
          <div className="mt-6 bg-surface-container border-2 border-outline-variant p-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface mb-2">
              Demo Credentials
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">User:</span>
                <span className="font-bold text-on-surface">
                  user@lazybiryani.com / user123
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Admin:</span>
                <span className="font-bold text-on-surface">
                  admin@lazybiryani.com / admin123
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-on-surface-variant mt-4">
          <a href="/" className="font-bold hover:text-primary transition-colors">
            &larr; Back to home
          </a>
        </p>
      </div>
    </div>
  );
}
