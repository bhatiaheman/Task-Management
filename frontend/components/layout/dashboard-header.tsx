import { LayoutDashboard, LogOut, Plus, RefreshCw } from "lucide-react";

type DashboardHeaderProps = {
  email?: string;
  onRefresh: () => void;
  onAddTask: () => void;
  onLogout: () => void;
};

export function DashboardHeader({ email, onRefresh, onAddTask, onLogout }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/25">
            <LayoutDashboard className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Task dashboard</h1>
            <p className="text-xs text-zinc-500">{email}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={onAddTask}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
          >
            <Plus className="h-4 w-4" />
            Add task
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
