import "dotenv/config";

function requiredInProd(name: string, value: string | undefined, fallback = "") {
  if (process.env.DEMO_MODE === "false" && process.env.NODE_ENV === "production" && !value) {
    console.warn(`Warning: ${name} is not set in production`);
  }
  return value ?? fallback;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "wedyora-dev-secret-change-me",
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? "wedyora-dev-refresh-change-me",
  accessTtl: process.env.JWT_ACCESS_TTL ?? "15m",
  refreshTtl: process.env.JWT_REFRESH_TTL ?? "7d",
  corsOrigins: (
    process.env.CORS_ORIGINS ??
    "http://localhost:5173,https://wedyora-platform.vercel.app,https://*.vercel.app"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  supabaseUrl: requiredInProd(
    "SUPABASE_URL",
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    ""
  ),
  supabaseServiceKey: requiredInProd(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY,
    ""
  ),
  // Prefer live Razorpay when keys exist; otherwise mock
  mockPayments:
    (process.env.MOCK_PAYMENTS ??
      (process.env.RAZORPAY_KEY_ID ? "false" : "true")) === "true",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ?? "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  demoMode: (process.env.DEMO_MODE ?? "true") === "true",
};

export const VENDOR_PLANS = [
  {
    key: "basic" as const,
    label: "Basic",
    registrationFee: 4999,
    deposit: 10000,
    features: ["Verified badge", "Up to 5 portfolio photos", "Lead notifications"],
  },
  {
    key: "premium" as const,
    label: "Premium",
    registrationFee: 9999,
    deposit: 15000,
    features: [
      "Priority matching",
      "Unlimited portfolio",
      "Featured carousel",
      "Chat with customers",
    ],
  },
  {
    key: "pro" as const,
    label: "Pro",
    registrationFee: 19999,
    deposit: 25000,
    features: [
      "Top placement",
      "Dedicated success manager",
      "Analytics",
      "Faster payouts",
    ],
  },
];
