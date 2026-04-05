import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutList, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[var(--tm-bg)] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% -30%, rgba(16, 185, 129, 0.2), transparent)",
        }}
      />
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-10 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-tight text-emerald-400">TaskFlow</span>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
            >
              Get started
            </Link>
          </div>
        </header>

        <main className="mt-16 flex flex-1 flex-col justify-center gap-12 sm:mt-24">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Your task management system for clear priorities and steady progress.
            </h1>
            <p className="text-lg text-zinc-400">
              Create tasks, track status, and focus on what matters. Sign in to keep lists private,
              search and filter your work, and update everything from a simple dashboard.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-base font-medium text-zinc-950 hover:bg-emerald-400"
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="grid gap-4 sm:grid-cols-3">
            <li className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
              <Shield className="mb-3 h-8 w-8 text-emerald-400" />
              <h2 className="font-medium">Private workspace</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Your own account so tasks stay separate and secure.
              </p>
            </li>
            <li className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
              <LayoutList className="mb-3 h-8 w-8 text-emerald-400" />
              <h2 className="font-medium">Lists that stay organized</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Add, edit, and sort work with status and quick search.
              </p>
            </li>
            <li className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
              <CheckCircle2 className="mb-3 h-8 w-8 text-emerald-400" />
              <h2 className="font-medium">Built for daily use</h2>
              <p className="mt-1 text-sm text-zinc-500">
                A clean layout that works on desktop and phone.
              </p>
            </li>
          </ul>
        </main>
      </div>
    </div>
  );
}
