import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler } from "./common/middleware/error-handler.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { tasksRouter } from "./modules/tasks/task.routes.js";

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/auth", authRouter);
  app.use("/tasks", tasksRouter);

  app.use(errorHandler);
  return app;
}
