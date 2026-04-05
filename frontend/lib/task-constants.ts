import type { TaskStatus } from "@/lib/types";

export const STATUS_OPTIONS: { value: "" | TaskStatus; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "TODO", label: "To do" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "DONE", label: "Done" },
];

export function statusLabel(s: TaskStatus): string {
  switch (s) {
    case "TODO":
      return "To do";
    case "IN_PROGRESS":
      return "In progress";
    case "DONE":
      return "Done";
  }
}

export const FORM_STATUS_OPTIONS = STATUS_OPTIONS.filter((o) => o.value !== "");
