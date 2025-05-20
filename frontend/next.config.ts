import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  experimental: { serverSourceMaps: false },
  allowedDevOrigins: ['http://localhost:3000', 'http://172.19.16.1:3000'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
