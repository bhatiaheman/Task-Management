import { Search } from "lucide-react";
import type { TaskStatus } from "@/lib/types";
import { STATUS_OPTIONS } from "@/lib/task-constants";

type TaskFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: "" | TaskStatus;
  onStatusChange: (value: "" | TaskStatus) => void;
};

export function TaskFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: TaskFiltersProps) {
  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title…"
          className="w-full rounded-xl border border-white/10 bg-zinc-900/80 py-2.5 pl-10 pr-4 text-sm text-white outline-none ring-emerald-500/30 focus:ring-2"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as "" | TaskStatus)}
        className="rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-2.5 text-sm text-white outline-none ring-emerald-500/30 focus:ring-2"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value || "all"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
