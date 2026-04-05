import bcrypt from "bcrypt";
import AppDataSource from "../../database/data-source.js";
import { HttpError } from "../../common/http-error.js";
import {
  createRefreshTokenValue,
  hashRefreshToken,
  refreshTokenExpiry,
} from "../../common/utils/refresh-token.js";
import { signAccessToken } from "../../common/utils/jwt.js";
import { RefreshToken } from "../../entities/refresh-token.entity.js";
import { User } from "../../entities/user.entity.js";

export type AuthUser = { id: string; email: string };

export type AuthTokens = {
  user: AuthUser;
  accessToken: string;
  refreshPlain: string;
};

async function persistRefreshSession(userId: string): Promise<string> {
  const refreshPlain = createRefreshTokenValue();
  const tokenHash = hashRefreshToken(refreshPlain);
  const rtRepo = AppDataSource.getRepository(RefreshToken);
  const rt = rtRepo.create({
    tokenHash,
    expiresAt: refreshTokenExpiry(),
    user: { id: userId },
  });
  await rtRepo.save(rt);
  return refreshPlain;
}

export async function registerUser(
  email: string,
  password: string,
): Promise<AuthTokens> {
  const passwordHash = await bcrypt.hash(password, 12);
  const userRepo = AppDataSource.getRepository(User);
  const user = userRepo.create({
    email: email.toLowerCase(),
    passwordHash,
  });
  await userRepo.save(user);
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshPlain = await persistRefreshSession(user.id);
  return {
    user: { id: user.id, email: user.email },
    accessToken,
    refreshPlain,
  };
}

export async function loginUser(email: string, password: string): Promise<AuthTokens> {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { email: email.toLowerCase() } });
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Invalid email or password");
  }
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshPlain = await persistRefreshSession(user.id);
  return {
    user: { id: user.id, email: user.email },
    accessToken,
    refreshPlain,
  };
}

export async function rotateRefreshSession(
  rawRefreshToken: string | undefined,
): Promise<AuthTokens> {
  if (!rawRefreshToken) {
    throw new HttpError(401, "Missing refresh token");
  }
  const tokenHash = hashRefreshToken(rawRefreshToken);
  const rtRepo = AppDataSource.getRepository(RefreshToken);
  const existing = await rtRepo.findOne({
    where: { tokenHash },
    relations: ["user"],
  });
  if (!existing || existing.expiresAt < new Date()) {
    if (existing) {
      await rtRepo.delete({ id: existing.id }).catch(() => undefined);
    }
    throw new HttpError(401, "Invalid or expired refresh token");
  }

  await rtRepo.delete({ id: existing.id });

  const u = existing.user;
  const accessToken = signAccessToken({
    sub: u.id,
    email: u.email,
  });
  const refreshPlain = await persistRefreshSession(u.id);
  return {
    user: { id: u.id, email: u.email },
    accessToken,
    refreshPlain,
  };
}

export async function revokeAllRefreshSessions(userId: string): Promise<void> {
  await AppDataSource.createQueryBuilder()
    .delete()
    .from(RefreshToken)
    .where('"userId" = :userId', { userId })
    .execute();
}
