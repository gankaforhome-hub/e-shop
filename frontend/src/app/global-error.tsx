'use client';

import { usePathname } from 'next/navigation';

import { noto, notoHryvnia, playfair } from '@/shared/config';
import { routes } from '@/shared/config/routes';
import { getPathname } from '@/shared/i18n/navigation';
import { defaultLocale, locales } from '@/shared/i18n/routing';
import '@/shared/styles/global.css';
import { getServerErrorTexts, ServerErrorWidget } from '@/widgets/server-error';

/**
 * Replaces the whole document when the root layout fails, which is what
 * happens when the backend API is unreachable (the header reads collections
 * from it). No providers exist here, so the locale comes from the URL.
 */
export default function GlobalError({ retry }: { retry: () => void }) {
  const segment = usePathname().split('/')[1];
  const locale = locales.find(item => item === segment) ?? defaultLocale;
  const texts = getServerErrorTexts(locale);

  return (
    <html lang={locale}>
      <body
        className={`${noto.variable} ${notoHryvnia.variable} ${playfair.variable} flex min-h-screen w-full flex-col antialiased`}
      >
        <title>{`${texts.pageTitle} | Ganka for Home`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <main className="flex flex-1 flex-col justify-center">
          <ServerErrorWidget
            texts={texts}
            homeHref={getPathname({ href: routes.home, locale })}
            onRetry={retry}
          />
        </main>
      </body>
    </html>
  );
}
