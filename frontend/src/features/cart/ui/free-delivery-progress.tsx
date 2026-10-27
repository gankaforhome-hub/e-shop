'use client';

import { useLocale, useTranslations } from 'next-intl';

import { getFreeDeliveryProgress } from '@/entities/cart';
import { type ProductPrice } from '@/entities/product';
import { type Locale } from '@/shared/i18n/routing';
import { cn, formatMoney } from '@/shared/lib/utils';
import { Text } from '@/shared/ui/text';

interface FreeDeliveryProgressProps {
  subtotal: ProductPrice;
}

/** "N left to free delivery" line with a thin bar that fills as the cart grows. */
export function FreeDeliveryProgress({ subtotal }: FreeDeliveryProgressProps) {
  const t = useTranslations('common.cart');
  const lang = useLocale() as Locale;
  const { remaining, ratio, reached } = getFreeDeliveryProgress(subtotal);
  const message = reached
    ? t('freeDeliveryReached')
    : t('freeDeliveryRemaining', { amount: formatMoney(remaining, lang) });

  return (
    <div className="flex flex-col gap-2">
      <Text as="p" size="small" aria-live="polite">
        {message}
      </Text>
      <div
        role="progressbar"
        aria-label={message}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
        className="bg-border h-1 w-full overflow-hidden rounded-full"
      >
        {/* Transform only: the fill glides without layout work */}
        <div
          className={cn(
            'duration-(--dur-slow) ease-subtle h-full w-full origin-left rounded-full transition-[transform,background-color] motion-reduce:transition-none',
            reached ? 'bg-status-success-fg' : 'bg-action-primary',
          )}
          style={{ transform: `scaleX(${ratio})` }}
        />
      </div>
    </div>
  );
}
