import type { Metadata } from 'next';

import type { MetadataSchema } from '@/shared/i18n/types';

interface BuildMetadataProps {
  meta: MetadataSchema;
  lang: string;
  path?: string;
  isLayout?: boolean;
}

export function buildMetadata({
  meta,
  lang,
  path = '',
  isLayout = false,
}: BuildMetadataProps): Metadata {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://gankaforhome.com';

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${baseUrl}/${lang}${cleanPath === '/' ? '' : cleanPath}`;
  const ogImage = meta.openGraph?.image || '/og-image.jpg';

  return {
    // Sets the base domain for relative links and OG images
    metadataBase: new URL(baseUrl),

    // Template for pages: "Catalog | Ganka for Home"
    title: isLayout
      ? {
          default: meta.title,
          template: '%s | Ganka for Home',
        }
      : meta.title,
    description: meta.description,
    keywords: meta.keywords,

    alternates: {
      canonical: canonicalUrl,
      languages: {
        uk: `${baseUrl}/uk${cleanPath === '/' ? '' : cleanPath}`,
        en: `${baseUrl}/en${cleanPath === '/' ? '' : cleanPath}`,
        'x-default': `${baseUrl}/uk${cleanPath === '/' ? '' : cleanPath}`,
      },
    },

    openGraph: {
      title: meta.openGraph?.title || meta.title,
      description: meta.openGraph?.description || meta.description,
      url: canonicalUrl,
      siteName: 'Ganka for Home',
      locale: lang === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage, // /og-image.jpg Відносний шлях, який Next.js перетворить на абсолютний завдяки metadataBase
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },

    twitter: {
      //TODO add image
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      // images: [ogImage], // Автоматично бере ту саму картинку
    },
  };
}
