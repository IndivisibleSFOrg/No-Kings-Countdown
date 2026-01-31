import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/No-Kings-Countdown',
  assetPrefix: '/No-Kings-Countdown/',
};

export default nextConfig;
