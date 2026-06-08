import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  outputFileTracingRoot: __dirname,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};
export default nextConfig;
