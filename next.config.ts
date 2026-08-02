import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for React Three Fiber / drei add-ons that ship untranspiled ESM.
  transpilePackages: ["three"],
};

export default nextConfig;
