import { Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";
import { AppError, AuthRequest } from "../types";

export const asyncHandler =
  (fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req as AuthRequest, res, next)).catch(next);
  };

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new AppError("Validation failed", 422, result.error.flatten().fieldErrors)
      );
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(
        new AppError("Invalid query parameters", 422, result.error.flatten().fieldErrors)
      );
    }
    (req as AuthRequest & { validatedQuery: T }).validatedQuery = result.data;
    next();
  };
}

export function success(res: Response, data: unknown, status = 200) {
  return res.status(status).json({ success: true, data });
}
