'use client';

import { useLocale, useTranslations } from 'next-intl';

import { routes } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { formatMoney } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

import { CartItemCard } from './cart-item';
import { FreeDeliveryProgress } from './free-delivery-progress';
import { useCart } from '../model/use-cart';

interface CartPanelProps {
  onNavigate?: () => void;
}

/** Cart body (lines + totals). Loaded lazily the first time the drawer opens. */
export default function CartPanel({ onNavigate }: CartPanelProps) {
  const t = useTranslations('common');
  const lang = useLocale() as Locale;
  const { lines, totalAmount, updateQuantity, removeLine } = useCart();

  if (lines.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Text className="text-muted-foreground">{t('cart.empty')}</Text>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-4">
        {lines.map(line => (
          <li key={line.id}>
            <CartItemCard
              line={line}
              onQuantityChange={updateQuantity}
              onRemove={removeLine}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>

      <div className="border-border bg-muted flex flex-col gap-4 border-t p-4">
        <FreeDeliveryProgress subtotal={totalAmount} />
        <div className="text-foreground flex items-center justify-between">
          <Text as="span" size="none" className="text-base font-medium">
            {t('label.total')}:
          </Text>
          <Text
            as="span"
            size="none"
            className="text-commerce-price-current text-xl font-semibold tabular-nums"
          >
            {formatMoney(totalAmount, lang)}
          </Text>
        </div>
        <Button asChild size="full" className="py-3">
          <AppLink href={routes.checkout} onClick={onNavigate}>
            {t('action.checkout')}
          </AppLink>
        </Button>
      </div>
    </>
  );
}
