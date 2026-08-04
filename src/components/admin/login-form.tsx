"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Landmark, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Email atau kata sandi salah.");
      setSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-5 rounded-lg border border-border-default bg-surface-card p-8"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-11 items-center justify-center rounded-md bg-ocean-600 text-white">
            <Landmark className="size-5" />
          </span>
          <h1 className="m-0 text-lg text-text-primary">Admin Panel</h1>
          <p className="m-0 text-[13px] text-text-muted">
            Kelurahan Jagong — masuk untuk mengelola konten situs.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-sm border border-border-default bg-surface-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-text-secondary">
              Kata sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-border-default bg-surface-card px-3 py-2.5 pr-10 text-sm text-text-primary outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-text-muted hover:text-text-secondary"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="m-0 rounded-sm bg-[#FEF2F2] px-3 py-2 text-[13px] text-[#B91C1C]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-ocean-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          <LogIn className="size-4" />
          {submitting ? "Memproses…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}
