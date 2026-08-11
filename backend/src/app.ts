import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import adminRoutes from "./routes/admin.routes.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (env.corsOrigins.includes(origin) || env.corsOrigins.includes("*")) {
          return cb(null, true);
        }
        // allow vercel/cloudflare preview tunnels in demos
        if (/vercel\.app$|trycloudflare\.com$|localhost:\d+$/.test(origin)) {
          return cb(null, true);
        }
        return cb(new Error(`CORS blocked: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      name: "Wedyora API",
      demoMode: env.demoMode,
      mockPayments: env.mockPayments,
    });
  });

  app.get("/api/docs", (_req, res) => {
    res.json({
      auth: ["POST /api/auth/register", "POST /api/auth/login", "POST /api/auth/refresh", "GET /api/auth/me"],
      vendors: [
        "GET /api/vendors",
        "GET /api/vendors/:id",
        "GET /api/vendors/plans",
        "GET|PUT /api/vendors/me/profile",
        "POST /api/vendors/me/deposit",
        "POST /api/vendors/me/bookings/:id/respond",
      ],
      customers: [
        "POST /api/customers/match",
        "POST /api/customers/bookings",
        "GET /api/customers/bookings",
        "POST /api/customers/bookings/:id/pay",
      ],
      dashboard: ["GET /api/dashboard", "GET /api/dashboard/notifications"],
      admin: ["GET /api/admin/vendors", "POST /api/admin/vendors/:id/review"],
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/vendors", vendorRoutes);
  app.use("/api/customers", customerRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/admin", adminRoutes);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  });

  return app;
}
