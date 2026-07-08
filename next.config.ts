import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the preview domain to access dev server resources without warnings
  allowedDevOrigins: [
    "*.space-z.ai",
    "preview-*.space-z.ai",
    "localhost:3000",
  ],
};

export default nextConfig;
