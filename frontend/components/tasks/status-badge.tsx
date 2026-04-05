import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import type { TaskStatus } from "@/lib/types";
import { statusLabel } from "@/lib/task-constants";

const styles: Record<TaskStatus, string> = {
  TODO: "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30",
  IN_PROGRESS: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  DONE: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${styles[status]}`}
    >
      {status === "TODO" && <Circle className="h-3 w-3" />}
      {status === "IN_PROGRESS" && <Clock3 className="h-3 w-3" />}
      {status === "DONE" && <CheckCircle2 className="h-3 w-3" />}
      {statusLabel(status)}
    </span>
  );
}
