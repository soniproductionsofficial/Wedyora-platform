import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for React Three Fiber / drei add-ons that ship untranspiled ESM.
  transpilePackages: ["three"],
  // Allow temporary review tunnels (Cloudflare / localtunnel) to hit the
  // Next.js dev server without "Unauthorized" / cross-origin blocks.
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "*.loca.lt",
    "localhost",
    "127.0.0.1",
  ],
  // Native View Transitions for fluid route navigations (Next.js 16 + React).
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
