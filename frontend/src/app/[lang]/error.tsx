'use client';

import { useLocale } from 'next-intl';

import { routes } from '@/shared/config/routes';
import { isValidLocale } from '@/shared/i18n/helpers';
import { getPathname } from '@/shared/i18n/navigation';
import { defaultLocale } from '@/shared/i18n/routing';
import { getServerErrorTexts, ServerErrorWidget } from '@/widgets/server-error';

/**
 * Boundary for failures inside a page (header and footer stay). When the
 * layout itself fails, e.g. the backend is down, `app/global-error.tsx` shows.
 */
export default function LocaleError({ retry }: { retry: () => void }) {
  const current = useLocale();
  const locale = isValidLocale(current) ? current : defaultLocale;

  return (
    <ServerErrorWidget
      texts={getServerErrorTexts(locale)}
      homeHref={getPathname({ href: routes.home, locale })}
      onRetry={retry}
    />
  );
}
