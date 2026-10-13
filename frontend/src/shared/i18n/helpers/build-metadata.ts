import type { Metadata } from 'next';

import { type AppRoutes, routes } from '@/shared/config/routes';
import { getPathname } from '@/shared/i18n/navigation';
import { defaultLocale, type Locale } from '@/shared/i18n/routing';
import type { MetadataSchema } from '@/shared/i18n/types';

interface BuildMetadataProps {
  meta: MetadataSchema;
  lang: Locale;
  path?: AppRoutes;
  isLayout?: boolean;
}

export function buildMetadata({
  meta,
  lang,
  path = routes.home,
  isLayout = false,
}: BuildMetadataProps): Metadata {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://gankaforhome.com';

  // Locale-aware like <Link>: `as-needed` → no prefix for the default locale
  const urlFor = (locale: Locale) =>
    `${baseUrl}${getPathname({ href: path, locale })}`;
  const canonicalUrl = urlFor(lang);
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
        uk: urlFor('uk'),
        en: urlFor('en'),
        'x-default': urlFor(defaultLocale),
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
