import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { HttpError } from "../http-error.js";

export type AuthedRequest = Request & {
  userId: string;
  userEmail: string;
};

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new HttpError(401, "Missing or invalid Authorization header"));
    return;
  }
  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    next(new HttpError(401, "Missing access token"));
    return;
  }
  try {
    const { sub, email } = verifyAccessToken(token);
    (req as AuthedRequest).userId = sub;
    (req as AuthedRequest).userEmail = email;
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired access token"));
  }
}
