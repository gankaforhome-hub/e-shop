'use client';

import { useEffect, useState, useTransition } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { type FavoriteItem, toggleFavorite } from '@/features/add-to-favorite';
import { apiRoutes, routes } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { Text } from '@/shared/ui/text';

import { FavoriteRow } from './favorite-row';

interface FavoritesPanelProps {
  onNavigate: () => void;
}

type ItemsResponse = { items?: FavoriteItem[] };

/** Wishlist body; mounts (and fetches) each time the drawer opens. */
export default function FavoritesPanel({ onNavigate }: FavoritesPanelProps) {
  const t = useTranslations('common.favorites');
  const lang = useLocale() as Locale;
  const [items, setItems] = useState<FavoriteItem[] | null>(null);
  // Rows moved to the bag: they fade out after the "Added" checkmark
  const [leaving, setLeaving] = useState<ReadonlySet<string>>(new Set());
  const [, startTransition] = useTransition();

  // External sync (network): the wishlist lives in an httpOnly cookie
  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ lang });

    fetch(`${apiRoutes.favorites}?${query.toString()}`, {
      signal: controller.signal,
    })
      .then(response => (response.ok ? response.json() : null))
      .then((data: ItemsResponse | null) => setItems(data?.items ?? []))
      // Offline: show the empty state rather than an endless skeleton
      .catch(() => {
        if (!controller.signal.aborted) {
          setItems([]);
        }
      });

    return () => controller.abort();
  }, [lang]);

  /** Drops the cookie entry; the action also re-renders the page's hearts. */
  const unfavorite = (productId: string) =>
    startTransition(async () => {
      try {
        await toggleFavorite(productId);
      } catch {
        // The cookie is unchanged, so the item reappears on the next open
      }
    });

  const dropRow = (productId: string) =>
    setItems(
      current => current?.filter(item => item.productId !== productId) ?? null,
    );

  const remove = (productId: string) => {
    dropRow(productId);
    unfavorite(productId);
  };

  // In the bag now, so it leaves the wishlist (no item in both places). The
  // cookie updates at once; the row stays for the checkmark, then fades out
  const moveToBag = (productId: string) => {
    unfavorite(productId);
    setLeaving(current => new Set(current).add(productId));
  };

  if (items === null) {
    return (
      <div className="flex flex-col gap-3 p-4" aria-busy="true">
        {[0, 1, 2].map(key => (
          <div key={key} className="flex items-center gap-3 p-3 sm:gap-5">
            <Skeleton className="size-16 shrink-0 rounded-none sm:size-24" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-36 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Text className="text-muted-foreground">{t('empty')}</Text>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-4">
        {items.map(item => (
          <li
            key={item.productId}
            data-leaving={leaving.has(item.productId) || undefined}
            // The 1ms reduced-motion duration still fires `transitionend`
            className="duration-(--dur-slow) ease-subtle data-leaving:opacity-0 data-leaving:delay-700 transition-opacity motion-reduce:duration-[1ms]"
            onTransitionEnd={event => {
              if (
                event.target === event.currentTarget &&
                leaving.has(item.productId)
              ) {
                dropRow(item.productId);
              }
            }}
          >
            <FavoriteRow
              item={item}
              onRemove={remove}
              onAddedToBag={moveToBag}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>

      {/* No tinted footer block: the button sits on the drawer background */}
      <div className="border-border border-t p-4">
        <Button asChild size="full" className="py-3">
          <AppLink href={routes.wishlist} onClick={onNavigate}>
            {t('viewAll')}
          </AppLink>
        </Button>
      </div>
    </>
  );
}
