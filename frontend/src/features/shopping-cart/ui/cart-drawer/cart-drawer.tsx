'use client';

import { useState } from 'react';

import { useCart } from '@/features/cart/model/cart-context';
import { CartItemCard } from '@/features/cart/ui/CartItem';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';

interface ICartDrawerProps {
  label?: {
    cart: string;
    close: string;
  };
  className?: string;
}

export function CartDrawer({ label, className }: ICartDrawerProps) {
  const [open, setOpen] = useState(false);
  const { cartItems, totalQuantity, totalAmount, isPending } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <SheetTrigger asChild className={className}>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label?.cart || ''}
          className="group relative"
        >
          <Icon
            name="shopping-cart"
            className={cn(
              'text-foreground size-6 max-[300px]:size-4',
              'group-hover:text-icon-hover duration-(--dur-norm) transition-colors',
            )}
          />

          {totalQuantity > 0 && (
            <span className="bg-accent-foreground absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
              {totalQuantity}
            </span>
          )}
        </Button>
      </SheetTrigger>

      {/* CART PANEL */}
      <SheetContent
        side="right"
        className="flex w-full max-w-xs flex-col p-0 md:max-w-lg"
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
      >
        {/* HEADER */}
        <SheetHeader className="border-brand/50 relative border-b-2 px-4 py-3">
          <SheetTitle className="h-8 text-left text-lg">
            {label?.cart || 'Кошик'}
            {isPending && (
              <span className="animate-pulse text-xs text-amber-600">
                Оновлення...
              </span>
            )}
          </SheetTitle>

          <Button
            variant="ghost"
            size="icon"
            aria-label={label?.close || ''}
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

        {/* CART CONTENT */}
        {/* <div className="flex-1 overflow-y-auto p-4">
          There will be a basket here
        </div> */}

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-gray-400">
              <p>Ваш кошик порожній</p>
            </div>
          ) : (
            cartItems.map(item => <CartItemCard key={item.id} item={item} />)
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="space-y-4 border-t bg-gray-50 p-4">
            <div className="flex items-center justify-between text-base font-medium text-gray-900">
              <span>Разом:</span>
              <span className="text-xl font-bold">{totalAmount} ₴</span>
            </div>
            <Button
              className="w-full py-3 font-medium shadow-sm"
              onClick={() => alert('Перехід до оформлення')}
            >
              Оформити замовлення
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
