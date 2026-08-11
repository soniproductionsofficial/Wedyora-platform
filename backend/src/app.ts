import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { clientOrigins, env } from "./config/env";
import { authenticate, authorize, errorHandler } from "./middleware/auth";
import authRoutes from "./routes/auth.routes";
import vendorRoutes from "./routes/vendor.routes";
import vendorsRoutes from "./routes/vendors.routes";
import customerRoutes from "./routes/customer.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import messageRoutes from "./routes/message.routes";
import * as customer from "./controllers/customerController";
import * as payments from "./controllers/paymentController";
import { validateBody } from "./utils/http";
import { customerPaymentSchema, mockConfirmSchema } from "./utils/validators";
import { AppError } from "./types";
import { readFileSync } from "fs";
import { join } from "path";
import { EVENT_TYPES, SERVICE_TYPES } from "./utils/validators";
import { mockPayments } from "./services/stripe";

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  if (clientOrigins.includes("*") || clientOrigins.includes(origin)) return true;

  // Demo tunnels (Cloudflare quick tunnels, localtunnel)
  try {
    const host = new URL(origin).hostname;
    if (
      host.endsWith(".trycloudflare.com") ||
      host.endsWith(".loca.lt") ||
      host.endsWith(".ngrok-free.app") ||
      host.endsWith(".ngrok.io")
    ) {
      return true;
    }
  } catch {
    return false;
  }

  // In development, also allow any localhost / 127.0.0.1 port
  if (env.NODE_ENV !== "production") {
    return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  }

  return false;
}

export function createApp(): Express {
  const app = express();

  app.use(helmet({
    // Allow the Vite/React app to be framed/opened via public demo tunnels
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));
  app.use(
    cors({
      origin: (origin, cb) => {
        if (isAllowedOrigin(origin)) {
          cb(null, true);
        } else {
          cb(new AppError(`Origin ${origin} not allowed by CORS`, 403));
        }
      },
      credentials: true,
    })
  );
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    payments.stripeWebhook
  );

  app.use(express.json({ limit: "2mb" }));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      data: {
        status: "ok",
        service: "wedyora-api",
        mockPayments,
        ts: new Date().toISOString(),
      },
    });
  });

  app.get("/api/meta", (_req, res) => {
    res.json({
      success: true,
      data: {
        serviceTypes: SERVICE_TYPES,
        eventTypes: EVENT_TYPES,
        mockPayments,
      },
    });
  });

  app.get("/api/payments/config", payments.getPaymentConfig);

  app.get("/api", (_req, res) => {
    res.json({
      success: true,
      data: {
        name: "Wedyora API",
        version: "1.1.0",
        docs: "/api/docs",
        mockPayments,
        endpoints: [
          "POST /api/auth/register",
          "POST /api/auth/login",
          "POST /api/auth/refresh",
          "GET /api/vendor/profile",
          "PUT /api/vendor/profile",
          "POST /api/vendor/deposit",
          "POST /api/vendor/accept-terms",
          "GET /api/vendor/assignments",
          "GET /api/vendors",
          "GET /api/customer/profile",
          "PUT /api/customer/profile",
          "POST /api/customer/search-vendors",
          "POST /api/customer/match",
          "POST /api/payments/customer",
          "POST /api/payments/confirm-mock",
          "POST /api/payments/webhook",
          "GET /api/messages",
          "POST /api/messages",
          "GET /api/dashboard",
        ],
      },
    });
  });

  app.get("/api/docs", (_req, res) => {
    try {
      const md = readFileSync(join(__dirname, "docs", "API.md"), "utf8");
      res.type("text/markdown").send(md);
    } catch {
      res.redirect(302, "/api");
    }
  });

  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/vendor", vendorRoutes);
  app.use("/api/vendors", vendorsRoutes);
  app.use("/api/customer", customerRoutes);
  app.use("/api/messages", messageRoutes);
  app.post(
    "/api/payments/customer",
    authenticate,
    authorize("customer"),
    validateBody(customerPaymentSchema),
    customer.createCustomerPayment
  );
  app.post(
    "/api/payments/confirm-mock",
    authenticate,
    validateBody(mockConfirmSchema),
    payments.confirmMockPayment
  );
  app.use("/api", dashboardRoutes);

  app.use((_req, _res, next) => next(new AppError("Route not found", 404)));
  app.use(errorHandler);

  return app;
}
