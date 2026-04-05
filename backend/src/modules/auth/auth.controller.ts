import type { Response } from "express";
import { env } from "../../config/env.js";
import { asyncHandler } from "../../common/middleware/async-handler.js";
import type { AuthedRequest } from "../../common/middleware/require-auth.js";
import { registerBodySchema, loginBodySchema } from "./auth.validation.js";
import {
  loginUser,
  registerUser,
  revokeAllRefreshSessions,
  rotateRefreshSession,
} from "./auth.service.js";
import { REFRESH_TOKEN_COOKIE } from "./auth.constants.js";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: env.CLIENT_ORIGIN.startsWith("https"),
    sameSite: "lax",
    path: "/",
    maxAge: env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
}

export const register = asyncHandler(async (req, res) => {
  const body = registerBodySchema.parse(req.body);
  const tokens = await registerUser(body.email, body.password);
  setRefreshCookie(res, tokens.refreshPlain);
  res.status(201).json({
    user: tokens.user,
    accessToken: tokens.accessToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const body = loginBodySchema.parse(req.body);
  const tokens = await loginUser(body.email, body.password);
  setRefreshCookie(res, tokens.refreshPlain);
  res.json({
    user: tokens.user,
    accessToken: tokens.accessToken,
  });
});

export const refresh = asyncHandler(async (req, res, next) => {
  const raw = req.cookies[REFRESH_TOKEN_COOKIE] as string | undefined;
  try {
    const tokens = await rotateRefreshSession(raw);
    setRefreshCookie(res, tokens.refreshPlain);
    res.json({
      user: tokens.user,
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    clearRefreshCookie(res);
    next(err);
    return;
  }
});

export const logout = asyncHandler(async (req, res) => {
  const { userId } = req as AuthedRequest;
  await revokeAllRefreshSessions(userId);
  clearRefreshCookie(res);
  res.status(204).end();
});
