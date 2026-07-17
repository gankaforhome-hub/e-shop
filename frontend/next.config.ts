import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  experimental: { serverSourceMaps: false },
  allowedDevOrigins: ['http://localhost:3000', 'http://172.19.16.1:3000'],

  turbopack: {
    // resolveAlias: {
    //   '@/*': './src/*',
    // },
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  webpack(config) {
    // Якщо Turbopack не використовується, налаштовуємо Webpack
    if (!process.env.NEXT_PRIVATE_TURBO) {
      // 2. Робимо аліас ідентичним за логікою
      config.resolve.alias['@'] = path.resolve(__dirname, 'src');

      // Додаємо лоадер для SVG
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
    }

    return config;
  },
};

export default nextConfig;
