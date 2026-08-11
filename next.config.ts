import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Serve real files from /public/marketplace/* first (JS/CSS/images).
      // Only SPA client routes fall through to index.html.
      fallback: [
        {
          source: "/marketplace",
          destination: "/marketplace/index.html",
        },
        {
          source: "/marketplace/:path*",
          destination: "/marketplace/index.html",
        },
      ],
    };
  },
};

export default nextConfig;
