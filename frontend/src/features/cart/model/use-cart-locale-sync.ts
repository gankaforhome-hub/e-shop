'use client';

import { useEffect } from 'react';

import { useLocale } from 'next-intl';

import { apiRoutes } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';

import { useCartStore } from './cart-store';

type TitlesResponse = { titles?: Record<string, string> };

/**
 * Re-translates cart line titles stored in another language (a language
 * switch, or lines added before `locale` was stored) via `apiRoutes.cartTitles`.
 */
export function useCartLocaleSync() {
  const lang = useLocale() as Locale;
  // A stable string, so the effect reruns only when the stale set changes
  const staleIds = useCartStore(state =>
    state.lines
      .filter(line => line.locale !== lang)
      .map(line => line.id)
      .join(','),
  );
  const relocalize = useCartStore(state => state.relocalize);

  // External sync (network): fetch titles for the lines in another language
  useEffect(() => {
    if (!staleIds) {
      return;
    }
    const controller = new AbortController();
    const query = new URLSearchParams({ lang, ids: staleIds });

    fetch(`${apiRoutes.cartTitles}?${query.toString()}`, {
      signal: controller.signal,
    })
      .then(response => (response.ok ? response.json() : null))
      .then((data: TitlesResponse | null) => {
        if (data?.titles) {
          relocalize(lang, data.titles);
        }
      })
      // Offline/aborted: the stored titles stay, the next change retries
      .catch(() => undefined);

    return () => controller.abort();
  }, [lang, staleIds, relocalize]);
}
