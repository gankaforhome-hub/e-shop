'use client';

import { useState } from 'react';

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <SheetTrigger asChild className={className}>
        <Button variant="ghost" size="icon" aria-label={label?.cart || ''}>
          <Icon
            name="shopping-cart"
            className="text-foreground size-6 max-[300px]:size-4"
          />
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
        <div className="flex-1 overflow-y-auto p-4">
          There will be a basket here
        </div>
      </SheetContent>
    </Sheet>
  );
}
