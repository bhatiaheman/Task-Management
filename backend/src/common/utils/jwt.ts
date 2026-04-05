import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";

export type AccessPayload = {
  sub: string;
  email: string;
};

export function signAccessToken(payload: AccessPayload): string {
  const options: SignOptions = {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string): AccessPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
  if (typeof decoded === "string" || !decoded || typeof decoded !== "object") {
    throw new Error("Invalid token payload");
  }
  const sub =
    typeof decoded.sub === "string"
      ? decoded.sub
      : typeof decoded.subject === "string"
        ? decoded.subject
        : undefined;
  const email = typeof decoded.email === "string" ? decoded.email : undefined;
  if (!sub || !email) {
    throw new Error("Invalid token payload");
  }
  return { sub, email };
}
