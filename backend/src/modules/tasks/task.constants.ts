import { TaskStatus } from "../../entities/task.entity.js";

export const TASK_STATUSES: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
];

export function nextTaskStatus(current: TaskStatus): TaskStatus {
  const order = TASK_STATUSES;
  const i = order.indexOf(current);
  return order[(i + 1) % order.length]!;
}
