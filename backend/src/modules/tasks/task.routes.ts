import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import * as taskController from "./task.controller.js";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

tasksRouter.get("/", taskController.list);
tasksRouter.post("/", taskController.create);
tasksRouter.post("/:id/toggle", taskController.toggle);
tasksRouter.get("/:id", taskController.getOne);
tasksRouter.patch("/:id", taskController.update);
tasksRouter.delete("/:id", taskController.remove);
