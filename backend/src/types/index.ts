import { Request } from "express";

export type UserRole = "customer" | "vendor" | "admin";

export interface JwtPayload {
  sub: string;
  role: UserRole;
  email: string;
  type: "access" | "refresh";
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email: string;
  };
}

export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}
