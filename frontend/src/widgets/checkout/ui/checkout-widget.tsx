'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { type CartLine, type CartTotals } from '@/entities/cart';
import { useCart, useCartHydrated, useCartRehydration } from '@/features/cart';
import {
  CheckoutForm,
  CheckoutSkeleton,
  saveLastOrder,
} from '@/features/checkout';
import { routes } from '@/shared/config/routes';
import { useRouter } from '@/shared/i18n/navigation';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

type CartSnapshot = CartTotals & { lines: CartLine[] };

/**
 * Checkout flow state: skeleton until the persisted cart is restored, then the
 * form (or an empty-cart prompt). A placed order clears the cart and moves to
 * `/checkout/success`; the form keeps a snapshot meanwhile so it never flashes
 * the empty state.
 */
export function CheckoutWidget() {
  useCartRehydration();
  const router = useRouter();
  const isHydrated = useCartHydrated();
  const { lines, totalAmount, totalQuantity, clear } = useCart();
  const [placed, setPlaced] = useState<CartSnapshot | null>(null);

  if (!placed && !isHydrated) {
    return <CheckoutSkeleton />;
  }

  if (!placed && lines.length === 0) {
    return <CheckoutEmpty />;
  }

  return (
    <CheckoutForm
      {...(placed ?? { lines, totalAmount, totalQuantity })}
      isRedirecting={Boolean(placed)}
      onSuccess={order => {
        saveLastOrder(order);
        setPlaced({ lines, totalAmount, totalQuantity });
        clear();
        router.push(routes.checkoutSuccess(order.orderId));
      }}
    />
  );
}

function CheckoutEmpty() {
  const t = useTranslations('common.checkout.empty');

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-12 text-center md:py-20">
      <div className="flex flex-col gap-2">
        <Heading
          headingLevel="h2"
          variant="subsection"
          tone="emphasis"
          position="center"
          className="mx-auto"
        >
          {t('title')}
        </Heading>
        <Text variant="muted" position="center" className="mx-auto">
          {t('description')}
        </Text>
      </div>
      <Button asChild size="large">
        <AppLink href={routes.products()}>{t('action')}</AppLink>
      </Button>
    </div>
  );
}
