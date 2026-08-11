import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  STRIPE_SECRET_KEY: z.string().default("sk_test_replace_me"),
  STRIPE_PUBLISHABLE_KEY: z.string().default("pk_test_replace_me"),
  STRIPE_WEBHOOK_SECRET: z.string().default("whsec_replace_me"),
  STRIPE_CURRENCY: z.string().default("inr"),
  VENDOR_DEPOSIT_AMOUNT: z.coerce.number().positive().default(500000),
  MOCK_PAYMENTS: z
    .enum(["true", "false", "1", "0", ""])
    .optional()
    .transform((v) => v === "true" || v === "1"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const clientOrigins = env.CLIENT_ORIGIN.split(",")
  .map((o) => o.trim())
  .filter(Boolean);
