import { Router } from "express";
import * as auth from "../controllers/authController";
import { validateBody } from "../utils/http";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../utils/validators";

const router = Router();

/**
 * @route POST /auth/register
 * @body { email, password, fullName, role: "customer"|"vendor", ... }
 */
router.post("/register", validateBody(registerSchema), auth.register);

/**
 * @route POST /auth/login
 */
router.post("/login", validateBody(loginSchema), auth.login);

/**
 * @route POST /auth/refresh
 */
router.post("/refresh", validateBody(refreshSchema), auth.refresh);

export default router;
