import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for React Three Fiber / drei add-ons that ship untranspiled ESM.
  transpilePackages: ["three"],
  // Native View Transitions for fluid route navigations (Next.js 16 + React).
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
