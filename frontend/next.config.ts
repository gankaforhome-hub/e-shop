import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps:false,
  experimental:{serverSourceMaps:false},
  eslint:{
  }
};

export default nextConfig;
