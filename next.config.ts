import type { NextConfig } from "next";

const allowedOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS
  ? process.env.NEXT_PUBLIC_ALLOWED_ORIGINS.split(",")
  : [];

const nextConfig: NextConfig = {
  allowedDevOrigins: allowedOrigins,
};

export default nextConfig;
