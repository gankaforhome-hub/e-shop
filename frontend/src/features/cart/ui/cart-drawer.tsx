'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';

import { useCart, useCartRehydration } from '../model/use-cart';

// The panel (lines, totals, money formatting) isn't needed until the drawer opens
const CartPanel = dynamic(() => import('./cart-panel'));

interface CartDrawerProps {
  className?: string;
}

export function CartDrawer({ className }: CartDrawerProps) {
  const t = useTranslations('common.cart');
  const [open, setOpen] = useState(false);
  const { totalQuantity } = useCart();
  useCartRehydration();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className={className}>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('open')}
          className="group relative"
        >
          <Icon
            name="shopping-cart"
            className={cn(
              'text-foreground size-6 max-[300px]:size-4',
              'group-hover:text-icon-hover duration-(--dur-normal) transition-colors',
            )}
          />
          {totalQuantity > 0 && (
            <span className="bg-accent-foreground text-background absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full text-xs font-bold tabular-nums">
              {totalQuantity}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full max-w-xs flex-col p-0 md:max-w-lg"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <SheetHeader className="border-brand/50 relative border-b-2 px-4 py-3">
          <SheetTitle className="h-8 text-left text-lg">
            {t('title')}
          </SheetTitle>
          <SheetDescription className="sr-only">{t('title')}</SheetDescription>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('close')}
            className="absolute right-2 top-2.5"
            onClick={() => setOpen(false)}
          >
            <Icon
              name="close"
              className="text-icon size-4"
              aria-hidden="true"
            />
          </Button>
        </SheetHeader>

        <CartPanel onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
