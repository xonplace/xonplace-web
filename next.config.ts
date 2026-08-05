import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.app.github.dev"],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.app.github.dev",
        "xonplace.com",
        "www.xonplace.com",
        "xonplace-web.vercel.app",
      ],
    },
  },
};

export default nextConfig;