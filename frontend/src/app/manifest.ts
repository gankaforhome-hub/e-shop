import type { MetadataRoute } from 'next';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { defaultLocale } from '@/shared/i18n/routing';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { common: t } = await getDictionary(['common'], defaultLocale);

  return {
    name: t.manifest.name,
    short_name: t.manifest.shortName,
    description: t.manifest.description,
    start_url: `/${defaultLocale}`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
// {
//   "name": "GankaForHome",
//   "short_name": "GankaForHome",
//   "icons": [
//     {
//       "src": "/web-app-manifest-192x192.png",
//       "sizes": "192x192",
//       "type": "image/png",
//       "purpose": "maskable"
//     },
//     {
//       "src": "/web-app-manifest-512x512.png",
//       "sizes": "512x512",
//       "type": "image/png",
//       "purpose": "maskable"
//     }
//   ],
//   "theme_color": "#ffffff",
//   "background_color": "#fff6f6",
//   "display": "standalone"
// }
