import bcrypt from "bcryptjs";
import jwt, { type SignOptions, type Secret } from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload, UserRole } from "../types";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

function signToken(
  payload: Omit<JwtPayload, "type"> & { type: JwtPayload["type"] },
  secret: Secret,
  expiresIn: string
): string {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] };
  return jwt.sign(payload, secret, options);
}

export function signAccessToken(user: {
  id: string;
  email: string;
  role: UserRole;
}): string {
  return signToken(
    { sub: user.id, email: user.email, role: user.role, type: "access" },
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN
  );
}

export function signRefreshToken(user: {
  id: string;
  email: string;
  role: UserRole;
}): string {
  return signToken(
    { sub: user.id, email: user.email, role: user.role, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN
  );
}

export function verifyAccessToken(token: string): JwtPayload {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  if (payload.type !== "access") {
    throw new Error("Invalid access token type");
  }
  return payload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  if (payload.type !== "refresh") {
    throw new Error("Invalid refresh token type");
  }
  return payload;
}
