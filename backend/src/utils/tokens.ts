import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { Role } from "../types/models.js";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export interface TokenPayload {
  sub: string;
  role: Role;
  email: string;
}

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.accessTtl } as jwt.SignOptions);
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.refreshTtl,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwtRefreshSecret) as TokenPayload;
}

export function publicUser(u: {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
}) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role,
    avatarUrl: u.avatarUrl,
    createdAt: u.createdAt,
  };
}
