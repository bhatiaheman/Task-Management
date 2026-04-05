export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
};

export type PaginatedTasks = {
  data: Task[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
