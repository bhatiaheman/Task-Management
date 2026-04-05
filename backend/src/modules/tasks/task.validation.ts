import { z } from "zod";
import { TaskStatus } from "../../entities/task.entity.js";
import { TASK_STATUSES } from "./task.constants.js";

const taskStatusSchema = z.nativeEnum(TaskStatus);

export const createTaskBodySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(500),
  description: z.string().trim().max(5000).optional(),
  status: taskStatusSchema.optional(),
});

export const updateTaskBodySchema = z
  .object({
    title: z.string().trim().min(1).max(500).optional(),
    description: z.string().trim().max(5000).nullable().optional(),
    status: taskStatusSchema.optional(),
  })
  .refine(
    (v) => v.title !== undefined || v.description !== undefined || v.status !== undefined,
    { message: "At least one field must be provided" },
  );

export const listTasksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z
    .string()
    .optional()
    .transform((s) => {
      if (!s) return undefined;
      const upper = s.toUpperCase();
      if ((TASK_STATUSES as readonly string[]).includes(upper)) {
        return upper as TaskStatus;
      }
      return undefined;
    }),
  search: z.string().trim().optional(),
});
