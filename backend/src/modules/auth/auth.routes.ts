import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import * as authController from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", requireAuth, authController.logout);
