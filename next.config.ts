import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/users": ["./dev.db"],
    "/api/register": ["./dev.db"],
  },
};

export default nextConfig;
