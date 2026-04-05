import AppDataSource from "../../database/data-source.js";
import { HttpError } from "../../common/http-error.js";
import { Task, TaskStatus } from "../../entities/task.entity.js";
import { nextTaskStatus } from "./task.constants.js";

export type ListTasksParams = {
  userId: string;
  page: number;
  limit: number;
  status?: TaskStatus;
  search?: string;
};

export async function listTasks(params: ListTasksParams) {
  const repo = AppDataSource.getRepository(Task);
  const qb = repo
    .createQueryBuilder("task")
    .where('task."userId" = :userId', { userId: params.userId });

  if (params.status !== undefined) {
    qb.andWhere("task.status = :status", { status: params.status });
  }
  if (params.search?.trim()) {
    qb.andWhere("task.title ILIKE :search", { search: `%${params.search.trim()}%` });
  }

  const total = await qb.clone().getCount();
  const items = await qb
    .clone()
    .orderBy("task.updatedAt", "DESC")
    .skip((params.page - 1) * params.limit)
    .take(params.limit)
    .getMany();

  return {
    data: items,
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / params.limit),
    },
  };
}

export async function createTask(
  userId: string,
  data: {
    title: string;
    description?: string | null;
    status?: TaskStatus;
  },
) {
  const repo = AppDataSource.getRepository(Task);
  const task = repo.create({
    title: data.title,
    description: data.description ?? null,
    status: data.status ?? TaskStatus.TODO,
    user: { id: userId },
  });
  return repo.save(task);
}

export async function getTaskById(userId: string, id: string) {
  const repo = AppDataSource.getRepository(Task);
  const task = await repo.findOne({
    where: { id, user: { id: userId } },
  });
  if (!task) {
    throw new HttpError(404, "Task not found");
  }
  return task;
}

export async function updateTask(
  userId: string,
  id: string,
  patch: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
  },
) {
  const repo = AppDataSource.getRepository(Task);
  const existing = await repo.findOne({
    where: { id, user: { id: userId } },
  });
  if (!existing) {
    throw new HttpError(404, "Task not found");
  }
  if (patch.title !== undefined) existing.title = patch.title;
  if (patch.description !== undefined) existing.description = patch.description;
  if (patch.status !== undefined) existing.status = patch.status;
  return repo.save(existing);
}

export async function deleteTask(userId: string, id: string) {
  const repo = AppDataSource.getRepository(Task);
  const existing = await repo.findOne({
    where: { id, user: { id: userId } },
  });
  if (!existing) {
    throw new HttpError(404, "Task not found");
  }
  await repo.delete({ id: existing.id });
}

export async function toggleTaskStatus(userId: string, id: string) {
  const repo = AppDataSource.getRepository(Task);
  const existing = await repo.findOne({
    where: { id, user: { id: userId } },
  });
  if (!existing) {
    throw new HttpError(404, "Task not found");
  }
  existing.status = nextTaskStatus(existing.status);
  return repo.save(existing);
}
