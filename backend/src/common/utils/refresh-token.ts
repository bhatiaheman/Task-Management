import crypto from "node:crypto";
import { env } from "../../config/env.js";

export function createRefreshTokenValue(): string {
  return crypto.randomBytes(48).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function refreshTokenExpiry(): Date {
  const d = new Date();
  d.setDate(d.getDate() + env.REFRESH_TOKEN_EXPIRES_DAYS);
  return d;
}
