import path from 'path';

import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

import { isIndexingAllowed } from './src/shared/config/indexing';

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pre-launch: `noindex` on every response (pages, images, PDFs) until
  // ALLOW_INDEXING=true — overrides page-level `robots` metadata
  async headers() {
    return isIndexingAllowed
      ? []
      : [
          {
            source: '/:path*',
            headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
          },
        ];
  },
  // Enables 'use cache' / cacheLife / cacheTag and Partial Prerendering
  cacheComponents: true,
  productionBrowserSourceMaps: false,
  // Info pages read Markdown via fs at runtime (cache revalidation) — ship it with the server output
  outputFileTracingIncludes: {
    '/[lang]/info/[infoSlug]': ['./dictionaries/**/*.md'],
  },
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF стискає ще краще за WebP
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1440, 1920, 2048],
    qualities: [75, 90],
    // 31 days instead of the 4h default: optimized variants of static assets
    // are re-generated far less often. Replace a changed image under a new
    // file name (CMS uploads get unique URLs anyway)
    minimumCacheTTL: 2678400,
  },
  allowedDevOrigins: [
    'localhost:3000',
    '172.19.16.1:3000',
    '*.devtunnels.ms',
    '2ks38grh-3000.euw.devtunnels.ms',
  ],

  experimental: {
    serverSourceMaps: false,
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '172.19.16.1:3000',
        '2ks38grh-3000.euw.devtunnels.ms',
        '*.devtunnels.ms',
        '*.euw.devtunnels.ms',
      ],
    },
  },

  logging: {
    browserToTerminal: true,
  },

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

export default withNextIntl(nextConfig);
