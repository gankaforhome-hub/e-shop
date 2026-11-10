'use client';

import { useRef, useState, useTransition } from 'react';

import { flushSync } from 'react-dom';

import { useLocale, useTranslations } from 'next-intl';

import {
  type AdminBanner,
  type BannerStatus,
  getBannerTitle,
  getLinkTargetTitle,
} from '@/entities/banner';
import { routes } from '@/shared/config';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import {
  type BannerOrderErrorKey,
  saveBannerOrderAction,
} from '../api/banner-order-actions';

// Previews are 12rem wide: a variant twice as wide covers 2x screens
const PREVIEW_MIN_WIDTH = 384;

const STATUS_VARIANT: Record<BannerStatus, 'default' | 'muted' | 'brand'> = {
  live: 'brand',
  scheduled: 'default',
  hidden: 'muted',
  expired: 'muted',
};

type Direction = 'up' | 'down';

/**
 * Every hero slide in its order, hidden and scheduled ones included. "Up" / "Down" save at
 * once; "Edit" opens the banner editor.
 */
export function BannersList({ banners }: { banners: AdminBanner[] }) {
  const t = useTranslations('banners');
  const locale = useLocale();
  const [order, setOrder] = useState(banners);
  const [error, setError] = useState<BannerOrderErrorKey | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [isSaving, startSaving] = useTransition();
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  // Saves run one after another, so the last click's order is the one that stays
  const queue = useRef(Promise.resolve());

  const move = (index: number, direction: Direction) => {
    const target = direction === 'up' ? index - 1 : index + 1;
    const moved = order[index];
    const other = order[target];
    if (!moved || !other) {
      return;
    }
    const previous = order;
    const next = order.map((item, position) =>
      position === index ? other : position === target ? moved : item,
    );
    const title = getBannerTitle(moved, locale);

    setError(null);
    // Render the new order now, so focus can follow the slide that moved
    flushSync(() => setOrder(next));
    const keepDirection =
      (direction === 'up' && target > 0) ||
      (direction === 'down' && target < next.length - 1);
    const focusDirection = keepDirection
      ? direction
      : direction === 'up'
        ? 'down'
        : 'up';
    buttons.current.get(`${moved.id}:${focusDirection}`)?.focus();
    setAnnouncement(
      t('moved', { title, position: target + 1, total: next.length }),
    );

    startSaving(async () => {
      queue.current = queue.current.then(async () => {
        const result = await saveBannerOrderAction(next.map(item => item.id));
        if (!result.ok) {
          setOrder(previous);
          setError(result.error);
        }
      });
      await queue.current;
    });
  };

  const register = (key: string) => (element: HTMLButtonElement | null) => {
    if (element) {
      buttons.current.set(key, element);
    } else {
      buttons.current.delete(key);
    }
  };

  const schedule = (banner: AdminBanner) => {
    const format = (iso: string) =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Europe/Kyiv',
      }).format(new Date(iso));
    if (banner.startsAt && banner.endsAt) {
      return t('schedule.range', {
        from: format(banner.startsAt),
        to: format(banner.endsAt),
      });
    }
    if (banner.startsAt) {
      return t('schedule.from', { from: format(banner.startsAt) });
    }
    return banner.endsAt
      ? t('schedule.to', { to: format(banner.endsAt) })
      : null;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Screen readers hear where the slide went */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      {error ? (
        <Text role="alert" size="sm" variant="destructive">
          {t(`errors.${error}`)}
        </Text>
      ) : null}

      <ol className="flex flex-col gap-3" aria-busy={isSaving}>
        {order.map((item, index) => {
          const title = getBannerTitle(item, locale);
          const subtitle =
            item.translations.find(text => text.languageCode === locale)
              ?.subtitle ??
            item.translations.find(text => text.languageCode === 'uk')
              ?.subtitle;
          const preview =
            item.image.variants.find(
              variant => variant.width >= PREVIEW_MIN_WIDTH,
            ) ?? item.image.variants.at(-1);
          const scheduleText = schedule(item);

          return (
            <li
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center"
            >
              <Text
                as="span"
                size="sm"
                weight="semibold"
                variant="muted"
                className="w-6 text-center tabular-nums"
                aria-label={t('position', { position: index + 1 })}
              >
                {index + 1}
              </Text>
              <span className="block aspect-video w-full shrink-0 overflow-hidden rounded-md bg-muted sm:w-48">
                {preview ? (
                  // Storage files are served as they are: the CMS has no image optimizer
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview.publicUrl}
                    alt=""
                    loading="lazy"
                    style={{ objectPosition: item.image.objectPosition }}
                    className="size-full object-cover"
                  />
                ) : null}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {subtitle ? (
                  <Text size="eyebrow" variant="muted">
                    {subtitle}
                  </Text>
                ) : null}
                <Text size="base" weight="semibold" variant="emphasis">
                  {title}
                </Text>
                <Text size="xs" variant="muted" className="truncate">
                  {item.collection
                    ? t('linkToCollection', {
                        title: getLinkTargetTitle(item.collection, locale),
                      })
                    : t('linkToUrl', { url: item.url ?? '' })}
                </Text>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Text
                    as="span"
                    size="xs"
                    weight="medium"
                    variant={STATUS_VARIANT[item.status]}
                  >
                    {t(`status.${item.status}`)}
                  </Text>
                  {scheduleText ? (
                    <Text as="span" size="xs" variant="muted">
                      {scheduleText}
                    </Text>
                  ) : null}
                  {item.collection && !item.collection.isActive ? (
                    <Text as="span" size="xs" variant="muted">
                      {t('collectionHidden')}
                    </Text>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1 sm:justify-end">
                <Button
                  ref={register(`${item.id}:up`)}
                  variant="ghost"
                  size="icon"
                  aria-label={t('moveUp', { title })}
                  disabled={index === 0}
                  onClick={() => move(index, 'up')}
                >
                  <Icon name="arrow-up" />
                </Button>
                <Button
                  ref={register(`${item.id}:down`)}
                  variant="ghost"
                  size="icon"
                  aria-label={t('moveDown', { title })}
                  disabled={index === order.length - 1}
                  onClick={() => move(index, 'down')}
                >
                  <Icon name="arrow-down" />
                </Button>
                <Button asChild variant="ghost">
                  <AppLink
                    href={routes.content.banner(item.id)}
                    aria-label={t('editAria', { title })}
                  >
                    <Icon name="edit" />
                    {t('edit')}
                  </AppLink>
                </Button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
