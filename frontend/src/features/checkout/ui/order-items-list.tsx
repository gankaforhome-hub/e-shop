'use client';

import { useLocale, useTranslations } from 'next-intl';

import { type OrderPayloadItem } from '@/entities/order';
import { type Locale } from '@/shared/i18n/routing';
import { formatMoney } from '@/shared/lib/utils';
import { AppMedia } from '@/shared/ui/app-media';
import { Text } from '@/shared/ui/text';

type OrderItemView = Pick<
  OrderPayloadItem,
  'id' | 'title' | 'variant' | 'image' | 'price' | 'quantity'
>;

interface OrderItemsListProps {
  items: readonly OrderItemView[];
}

const uah = (amount: number) => ({ amount, currency: 'UAH' as const });

/**
 * Compact line list: thumbnail with a quantity badge, title, variant, unit and
 * line price. Scrolls inside a fixed height so long carts keep the card balanced.
 */
export function OrderItemsList({ items }: OrderItemsListProps) {
  const t = useTranslations('common.checkout.summary');
  const lang = useLocale() as Locale;

  return (
    // pt/pr leave room for the badges that overhang the thumbnails
    <ul className="scrollbar-thin -mr-2 flex max-h-[260px] flex-col gap-4 overflow-y-auto overscroll-contain pr-2 pt-2">
      {items.map(item => (
        <li key={item.id} className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="bg-background relative size-16 overflow-hidden rounded-md">
              <AppMedia
                src={item.image}
                alt={item.title}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </div>
            <span
              aria-hidden="true"
              className="bg-accent-foreground text-background absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-medium tabular-nums"
            >
              {item.quantity}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Text
              as="span"
              size="none"
              className="line-clamp-2 text-sm leading-snug"
            >
              {item.title}
            </Text>
            {item.variant && (
              <Text as="span" size="none" variant="muted" className="text-xs">
                {item.variant}
              </Text>
            )}
            <Text
              as="span"
              size="none"
              variant="muted"
              className="text-xs tabular-nums"
            >
              {formatMoney(uah(item.price), lang)}
              <span className="sr-only">
                {' '}
                {t('quantity', { count: item.quantity })}
              </span>
            </Text>
          </div>

          <Text
            as="span"
            size="none"
            className="text-foreground-emphasis shrink-0 text-sm font-medium tabular-nums"
          >
            {formatMoney(uah(item.price * item.quantity), lang)}
          </Text>
        </li>
      ))}
    </ul>
  );
}
