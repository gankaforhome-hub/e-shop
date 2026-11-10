import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enables 'use cache' / cacheLife / cacheTag and Partial Prerendering
  cacheComponents: true,
  productionBrowserSourceMaps: false,
  // Private admin panel: never indexed, whatever a page's metadata says
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
  logging: {
    browserToTerminal: true,
  },
  // Image uploads go through Server Actions: the default 1 MB would reject most photos
  // (the client compresses first, the API itself accepts up to 10 MB)
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
  // The default bottom-left spot covers the sidebar footer (Settings, Profile)
  devIndicators: {
    position: 'bottom-right',
  },
};

export default withNextIntl(nextConfig);
