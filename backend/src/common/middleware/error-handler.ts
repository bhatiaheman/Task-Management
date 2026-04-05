import type { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import { ZodError } from "zod";
import { HttpError } from "../http-error.js";

function isPgUniqueViolation(err: unknown): boolean {
  if (!(err instanceof QueryFailedError)) return false;
  const code = (err as QueryFailedError & { driverError?: { code?: string } }).driverError?.code;
  return code === "23505";
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: err.flatten(),
    });
    return;
  }
  if (isPgUniqueViolation(err)) {
    res.status(409).json({ error: "A record with this value already exists" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
