import { Loader2, Plus } from "lucide-react";
import type { Task } from "@/lib/types";
import { TaskCard } from "./task-card";

type TaskListProps = {
  tasks: Task[];
  loading: boolean;
  onAdd: () => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskList({ tasks, loading, onAdd, onToggle, onEdit, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-900/40 px-8 py-16 text-center">
        <p className="text-zinc-400">No tasks match your filters.</p>
        <button
          type="button"
          onClick={onAdd}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-zinc-950"
        >
          <Plus className="h-4 w-4" />
          Create your first task
        </button>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
