'use client';

import { useLocale, useTranslations } from 'next-intl';

import { routes } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { formatMoney } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { OrderItemsList } from './order-items-list';
import { type LastOrder, useLastOrder } from '../model/last-order';

interface OrderSuccessProps {
  /** From `?orderId=`; absent when the page is opened without a valid id. */
  orderId?: string;
}

/**
 * Confirmation page body: shown after a pay-on-delivery / bank-transfer order
 * and as the LiqPay return target. Details come from this tab's session, so a
 * direct visit (or another device) still gets the thank-you and the order id.
 */
export function OrderSuccess({ orderId }: OrderSuccessProps) {
  const t = useTranslations('common.checkout.success');
  const order = useLastOrder(orderId);

  return (
    <div className="duration-(--dur-slow) ease-subtle starting:translate-y-2 starting:opacity-0 mx-auto flex w-full max-w-2xl flex-col items-center gap-8 text-center transition-[opacity,translate] motion-reduce:transition-none">
      <div role="status" className="flex flex-col items-center gap-6">
        <span className="bg-status-success-bg text-status-success-fg inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4">
          <span className="bg-status-success-icon text-background flex size-6 items-center justify-center rounded-full">
            <Icon name="check" aria-hidden="true" className="stroke-3 size-4" />
          </span>
          <Text
            as="span"
            size="none"
            variant="inherit"
            className="text-sm font-medium"
          >
            {t('badge')}
          </Text>
        </span>

        <div className="flex flex-col gap-3">
          <Heading
            headingLevel="h1"
            variant="document"
            tone="emphasis"
            position="center"
            className="mx-auto"
          >
            {t('title')}
          </Heading>
          <Text position="center" className="mx-auto">
            {t('message')}
          </Text>
        </div>

        {orderId && (
          <div className="bg-muted flex flex-col gap-1 rounded-lg px-8 py-4">
            <Text as="span" size="none" variant="muted" className="text-sm">
              {t('orderNumber')}
            </Text>
            <Text
              as="span"
              size="none"
              className="text-foreground-emphasis select-all text-2xl font-semibold tabular-nums tracking-wider md:text-3xl"
            >
              {orderId}
            </Text>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button asChild variant="outline" size="large">
          <AppLink href={routes.home}>{t('toHome')}</AppLink>
        </Button>
        <Button asChild size="large">
          <AppLink href={routes.products()}>{t('toCatalog')}</AppLink>
        </Button>
      </div>

      {order && <OrderDetails order={order} />}
    </div>
  );
}

function OrderDetails({ order }: { order: LastOrder }) {
  const t = useTranslations('common.checkout');
  const lang = useLocale() as Locale;
  const { delivery } = order;
  const destination = [
    delivery.country,
    delivery.city,
    delivery.branchOrAddress,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <section
      aria-labelledby="order-details-title"
      className="bg-muted flex w-full flex-col gap-6 rounded-lg px-5 py-6 text-left md:px-8 md:py-8"
    >
      <Heading
        id="order-details-title"
        headingLevel="h2"
        variant="subsection"
        tone="emphasis"
      >
        {t('success.details.title')}
      </Heading>

      <OrderItemsList items={order.items} />

      <dl className="border-border flex flex-col gap-3 border-t pt-5 text-sm md:text-base">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-6">
          <Text as="dt" size="none" variant="muted">
            {t('success.details.delivery')}
          </Text>
          <Text as="dd" size="none" className="sm:text-right">
            {t(`delivery.${delivery.method}.title`)}
            {destination && (
              <Text
                as="span"
                size="none"
                variant="muted"
                className="block text-sm"
              >
                {destination}
              </Text>
            )}
          </Text>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-6">
          <Text as="dt" size="none" variant="muted">
            {t('success.details.payment')}
          </Text>
          <Text as="dd" size="none" className="sm:text-right">
            {t(`payment.${order.payment.method}.title`)}
          </Text>
        </div>
        <div className="border-border mt-1 flex items-baseline justify-between gap-4 border-t pt-4">
          <Text as="dt" size="none" className="font-medium">
            {t('success.details.total')}
          </Text>
          <Text
            as="dd"
            size="none"
            className="text-foreground-emphasis text-xl font-semibold tabular-nums md:text-2xl"
          >
            {formatMoney(
              { amount: order.totals.grandTotal, currency: 'UAH' },
              lang,
            )}
          </Text>
        </div>
      </dl>
    </section>
  );
}
