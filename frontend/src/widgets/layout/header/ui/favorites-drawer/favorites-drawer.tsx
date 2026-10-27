'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import { useTranslations } from 'next-intl';

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

// Fetches the wishlist when it mounts, i.e. each time the drawer opens
const FavoritesPanel = dynamic(() => import('./favorites-panel'));

interface FavoritesDrawerProps {
  className?: string;
}

/** Wishlist slide-over: same shell, backdrop and motion as `CartDrawer`. */
export function FavoritesDrawer({ className }: FavoritesDrawerProps) {
  const t = useTranslations('common.favorites');
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className={className}>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('open')}
          className="group"
        >
          <Icon
            name="favorite"
            size={24}
            className="group-hover:text-icon-hover duration-(--dur-normal) transition-colors"
          />
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

        <FavoritesPanel onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
