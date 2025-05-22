import path from 'path';

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

  webpack(config) {
    // If Turbopack is not used, we use Webpack for SVG
    if (!process.env.NEXT_PRIVATE_TURBO) {
      config.resolve.alias['@'] = path.resolve(__dirname, 'src');

      // Add the Lader to process SVG
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'], // Use @svgr to process SVG
      });
    }

    return config;
  },
};

export default nextConfig;
