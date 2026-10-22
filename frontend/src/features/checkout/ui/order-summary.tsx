'use client';

import { type ReactNode } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { type CartLine, type CartTotals } from '@/entities/cart';
import { type Locale } from '@/shared/i18n/routing';
import { formatMoney } from '@/shared/lib/utils';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

import { OrderItemsList } from './order-items-list';
import { toPayloadItem } from '../lib/build-order-payload';

interface OrderSummaryProps extends CartTotals {
  lines: readonly CartLine[];
  /** Consent and submit, rendered under the totals. */
  footer?: ReactNode;
}

export function OrderSummary({
  lines,
  totalAmount,
  totalQuantity,
  footer,
}: OrderSummaryProps) {
  const t = useTranslations('common.checkout.summary');
  const lang = useLocale() as Locale;

  return (
    <section
      aria-labelledby="checkout-summary-title"
      className="bg-muted flex flex-col gap-6 rounded-lg px-5 py-6 md:px-8 md:py-8"
    >
      <div className="flex items-baseline justify-between gap-4">
        <Heading
          id="checkout-summary-title"
          headingLevel="h2"
          variant="subsection"
          tone="emphasis"
        >
          {t('title')}
        </Heading>
        <Text as="span" size="none" className="text-sm">
          {t('items', { count: totalQuantity })}
        </Text>
      </div>

      <OrderItemsList items={lines.map(toPayloadItem)} />

      <dl className="border-border flex flex-col gap-3 border-t pt-5 text-sm md:text-base">
        <div className="flex justify-between gap-4">
          <Text as="dt" size="none">
            {t('subtotal')}
          </Text>
          <Text as="dd" size="none" className="tabular-nums">
            {formatMoney(totalAmount, lang)}
          </Text>
        </div>
        <div className="flex justify-between gap-4">
          <Text as="dt" size="none">
            {t('shipping')}
          </Text>
          <Text as="dd" size="none" className="text-right">
            {t('shippingNote')}
          </Text>
        </div>
        <div className="border-border mt-1 flex items-baseline justify-between gap-4 border-t pt-4">
          <Text as="dt" size="none" className="font-medium">
            {t('total')}
          </Text>
          <Text
            as="dd"
            size="none"
            className="text-foreground-emphasis text-xl font-semibold tabular-nums md:text-2xl"
          >
            {formatMoney(totalAmount, lang)}
          </Text>
        </div>
      </dl>

      {footer}
    </section>
  );
}
