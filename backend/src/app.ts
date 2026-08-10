import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { clientOrigins } from "./config/env";
import { authenticate, authorize, errorHandler } from "./middleware/auth";
import authRoutes from "./routes/auth.routes";
import vendorRoutes from "./routes/vendor.routes";
import vendorsRoutes from "./routes/vendors.routes";
import customerRoutes from "./routes/customer.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import * as customer from "./controllers/customerController";
import * as payments from "./controllers/paymentController";
import { validateBody } from "./utils/http";
import { customerPaymentSchema } from "./utils/validators";
import { AppError } from "./types";
import { readFileSync } from "fs";
import { join } from "path";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        if (
          !origin ||
          clientOrigins.includes(origin) ||
          clientOrigins.includes("*")
        ) {
          cb(null, true);
        } else {
          cb(new AppError(`Origin ${origin} not allowed by CORS`, 403));
        }
      },
      credentials: true,
    })
  );
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  // Stripe webhook needs raw body — mount BEFORE json parser
  app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    payments.stripeWebhook
  );

  app.use(express.json({ limit: "1mb" }));

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
        ts: new Date().toISOString(),
      },
    });
  });

  app.get("/api", (_req, res) => {
    res.json({
      success: true,
      data: {
        name: "Wedyora API",
        version: "1.0.0",
        docs: "/api/docs",
        endpoints: [
          "POST /api/auth/register",
          "POST /api/auth/login",
          "POST /api/auth/refresh",
          "GET /api/vendor/profile",
          "PUT /api/vendor/profile",
          "POST /api/vendor/deposit",
          "POST /api/vendor/accept-terms",
          "GET /api/vendors",
          "POST /api/customer/search-vendors",
          "POST /api/payments/customer",
          "POST /api/vendor/deposit  (vendor deposit payment)",
          "POST /api/payments/webhook",
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
  app.post(
    "/api/payments/customer",
    authenticate,
    authorize("customer"),
    validateBody(customerPaymentSchema),
    customer.createCustomerPayment
  );
  app.use("/api", dashboardRoutes);

  app.use((_req, _res, next) => next(new AppError("Route not found", 404)));
  app.use(errorHandler);

  return app;
}
