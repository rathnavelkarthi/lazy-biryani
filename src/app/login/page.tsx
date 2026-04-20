"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { BrutalistButton } from "@/components/ui/BrutalistButton";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const { resetPassword } = useAuth();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    const result = await resetPassword(forgotEmail);
    if (result.error) {
      setForgotError(result.error);
      return;
    }
    setForgotSent(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }
      const result = await signup(email, password, name);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      router.push("/menu");
    } else {
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
    }
  };

  const fillDemo = (type: "admin" | "user") => {
    setMode("login");
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

        {/* Login/Signup card */}
        <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 sm:p-8">
          {/* Mode toggle */}
          <div className="flex border-4 border-[#333333] mb-6">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wider transition-all ${
                mode === "login"
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wider transition-all border-l-4 border-[#333333] ${
                mode === "signup"
                  ? "bg-tertiary-container text-on-tertiary-container"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              Sign Up
            </button>
          </div>

          <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-2xl sm:text-3xl font-black text-on-surface tracking-tight mb-2">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-on-surface-variant text-sm mb-6">
            {mode === "login"
              ? "Sign in to order or manage the shop."
              : "Join the lazy biryani revolution."}
          </p>

          {/* Demo credential buttons (login only) */}
          {mode === "login" && (
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
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-surface border-4 border-[#333333] px-4 py-3 text-base font-bold focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            )}

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
                placeholder={mode === "signup" ? "Min 6 characters" : "Enter password"}
                required
                minLength={6}
                className="w-full bg-surface border-4 border-[#333333] px-4 py-3 text-base font-bold focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container border-2 border-error px-4 py-2 text-sm font-bold">
                {error}
              </div>
            )}

            <BrutalistButton
              variant={mode === "signup" ? "danger" : "danger"}
              size="md"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading
                ? (mode === "login" ? "Signing in..." : "Creating account...")
                : (mode === "login" ? "Sign In" : "Create Account")}
            </BrutalistButton>
          </form>

          {/* Forgot password link */}
          {mode === "login" && (
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="mt-3 text-sm font-bold text-primary hover:underline w-full text-center"
            >
              Forgot your password?
            </button>
          )}

          {/* Demo credentials info (login only) */}
          {mode === "login" && (
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
          )}
        </div>

        <p className="text-center text-xs text-on-surface-variant mt-4">
          <a href="/" className="font-bold hover:text-primary transition-colors">
            &larr; Back to home
          </a>
        </p>
      </div>

      {/* Forgot password modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 max-w-sm w-full">
            {forgotSent ? (
              <div className="text-center">
                <div className="bg-tertiary-container w-14 h-14 flex items-center justify-center mx-auto mb-4 border-2 border-[#333333]">
                  <span className="material-symbols-outlined text-tertiary text-3xl">mail</span>
                </div>
                <h2 className="font-[family-name:var(--font-plus-jakarta-sans)] text-xl font-black text-on-surface mb-2">
                  Check your email
                </h2>
                <p className="text-sm text-on-surface-variant mb-4">
                  We sent a password reset link to <span className="font-bold">{forgotEmail}</span>
                </p>
                <BrutalistButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}
                >
                  Back to Login
                </BrutalistButton>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <h2 className="font-[family-name:var(--font-plus-jakarta-sans)] text-xl font-black text-on-surface mb-2">
                  Reset Password
                </h2>
                <p className="text-sm text-on-surface-variant mb-4">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-surface border-4 border-[#333333] px-4 py-3 text-base font-bold focus:outline-none focus:border-primary transition-colors mb-3"
                />
                {forgotError && (
                  <div className="bg-error-container text-on-error-container border-2 border-error px-4 py-2 text-sm font-bold mb-3">
                    {forgotError}
                  </div>
                )}
                <div className="flex gap-3">
                  <BrutalistButton
                    type="button"
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => { setShowForgot(false); setForgotError(""); }}
                  >
                    Cancel
                  </BrutalistButton>
                  <BrutalistButton type="submit" variant="danger" size="md" className="flex-1">
                    Send Reset Link
                  </BrutalistButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
