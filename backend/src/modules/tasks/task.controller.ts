import type { Request } from "express";
import { asyncHandler } from "../../common/middleware/async-handler.js";
import { HttpError } from "../../common/http-error.js";
import type { AuthedRequest } from "../../common/middleware/require-auth.js";
import {
  createTaskBodySchema,
  listTasksQuerySchema,
  updateTaskBodySchema,
} from "./task.validation.js";
import * as taskService from "./task.service.js";

function routeParamId(req: Request): string {
  const raw = req.params.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id) {
    throw new HttpError(400, "Missing task id");
  }
  return id;
}

export const list = asyncHandler(async (req, res) => {
  const { userId } = req as AuthedRequest;
  const q = listTasksQuerySchema.parse(req.query);
  const result = await taskService.listTasks({
    userId,
    page: q.page,
    limit: q.limit,
    ...(q.status ? { status: q.status } : {}),
    ...(q.search ? { search: q.search } : {}),
  });
  res.json(result);
});

export const create = asyncHandler(async (req, res) => {
  const { userId } = req as AuthedRequest;
  const body = createTaskBodySchema.parse(req.body);
  const task = await taskService.createTask(userId, {
    title: body.title,
    description: body.description ?? null,
    status: body.status,
  });
  res.status(201).json(task);
});

export const getOne = asyncHandler(async (req, res) => {
  const { userId } = req as AuthedRequest;
  const task = await taskService.getTaskById(userId, routeParamId(req));
  res.json(task);
});

export const update = asyncHandler(async (req, res) => {
  const { userId } = req as AuthedRequest;
  const body = updateTaskBodySchema.parse(req.body);
  const task = await taskService.updateTask(userId, routeParamId(req), {
    ...(body.title !== undefined ? { title: body.title } : {}),
    ...(body.description !== undefined ? { description: body.description } : {}),
    ...(body.status !== undefined ? { status: body.status } : {}),
  });
  res.json(task);
});

export const remove = asyncHandler(async (req, res) => {
  const { userId } = req as AuthedRequest;
  await taskService.deleteTask(userId, routeParamId(req));
  res.status(204).end();
});

export const toggle = asyncHandler(async (req, res) => {
  const { userId } = req as AuthedRequest;
  const task = await taskService.toggleTaskStatus(userId, routeParamId(req));
  res.json(task);
});
