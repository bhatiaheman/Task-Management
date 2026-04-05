"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const { user, ready, register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password);
      toast.success("Account created");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--tm-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--tm-bg)] px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 185, 129, 0.25), transparent)",
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
            <UserPlus className="h-7 w-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Create account</h1>
          <p className="text-sm text-zinc-400">Start organizing your work in one place</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-xl shadow-black/40 backdrop-blur"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none ring-emerald-500/40 transition focus:border-emerald-500/50 focus:ring-2"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none ring-emerald-500/40 transition focus:border-emerald-500/50 focus:ring-2"
              placeholder="At least 8 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 py-3 font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
          <p className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
