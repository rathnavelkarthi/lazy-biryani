"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { BrutalistButton } from "@/components/ui/BrutalistButton";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
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

        <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 sm:p-8">
          {success ? (
            <div className="text-center">
              <div className="bg-tertiary-container w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-[#333333]">
                <span className="material-symbols-outlined text-tertiary text-4xl">check_circle</span>
              </div>
              <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-2xl font-black text-on-surface mb-2">
                Password Updated!
              </h1>
              <p className="text-on-surface-variant text-sm">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-2xl sm:text-3xl font-black text-on-surface tracking-tight mb-2">
                Set New Password
              </h1>
              <p className="text-on-surface-variant text-sm mb-6">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    className="w-full bg-surface border-4 border-[#333333] px-4 py-3 text-base font-bold focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
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
                  {loading ? "Updating..." : "Update Password"}
                </BrutalistButton>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
