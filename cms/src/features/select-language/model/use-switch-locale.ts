'use client';

import { useLocale } from 'next-intl';

import { getPathname, usePathname } from '@/shared/i18n/navigation';
import { type Locale } from '@/shared/i18n/routing';

/**
 * Reloads the current page in another locale. `<html lang>` belongs to the
 * root layout, so a document load renders it fresh — a client transition
 * would re-render the root layout and reset `<html>` (theme class, sidebar
 * state). The explicit prefix (`/uk/…`) lets the proxy store the choice in
 * the locale cookie before it drops the default-locale prefix.
 */
export function useSwitchLocale() {
  const locale = useLocale();
  const pathname = usePathname();

  const switchLocale = (next: Locale) => {
    if (next !== locale) {
      window.location.assign(
        getPathname({ href: pathname, locale: next, forcePrefix: true }),
      );
    }
  };

  return { locale, switchLocale };
}
