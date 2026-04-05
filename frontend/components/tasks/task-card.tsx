import { Pencil, RefreshCw, Trash2 } from "lucide-react";
import type { Task } from "@/lib/types";
import { StatusBadge } from "./status-badge";

type TaskCardProps = {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <li className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-5 shadow-lg shadow-black/20 transition hover:border-emerald-500/25 hover:bg-zinc-900/90">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <span className="text-xs text-zinc-500">
              Updated {new Date(task.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-lg font-medium text-white">{task.title}</h2>
          {task.description ? (
            <p className="line-clamp-3 text-sm text-zinc-400">{task.description}</p>
          ) : (
            <p className="text-sm italic text-zinc-600">No description</p>
          )}
        </div>
        <div className="flex shrink-0 gap-1 sm:flex-col">
          <button
            type="button"
            onClick={() => onToggle(task)}
            title="Cycle status"
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-emerald-400"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-500/15 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
