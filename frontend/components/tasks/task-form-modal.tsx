import type { TaskStatus } from "@/lib/types";
import { FORM_STATUS_OPTIONS } from "@/lib/task-constants";

export type ModalMode = "create" | "edit" | null;

type TaskFormModalProps = {
  mode: Exclude<ModalMode, null>;
  title: string;
  description: string;
  status: TaskStatus;
  saving: boolean;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onStatusChange: (v: TaskStatus) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function TaskFormModal({
  mode,
  title,
  description,
  status,
  saving,
  onTitleChange,
  onDescriptionChange,
  onStatusChange,
  onClose,
  onSubmit,
}: TaskFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center sm:p-6">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-lg font-semibold text-white">
          {mode === "create" ? "New task" : "Edit task"}
        </h2>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Title</label>
            <input
              required
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Status</label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              {FORM_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/15 py-3 text-sm font-medium text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-medium text-zinc-950 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
