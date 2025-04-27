import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  experimental: { serverSourceMaps: false },
  // eslint: {
  //   dirs: ['src'],
  // },
};

export default nextConfig;
