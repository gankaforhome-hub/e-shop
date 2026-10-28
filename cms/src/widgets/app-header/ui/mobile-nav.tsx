'use client';

import { useState, type MouseEvent, type ReactNode } from 'react';

import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';

interface MobileNavProps {
  labels: { open: string; close: string; title: string; description: string };
  /** Server-rendered slots: the sheet only adds open/close behaviour. */
  brand: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

/** Below `md`: the sidebar's navigation plus header controls in a left sheet. */
export function MobileNav({ labels, brand, footer, children }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  // Following any link inside closes the sheet (it stays mounted across navigations)
  const closeOnLinkClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('a[href]')) {
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-ml-1 md:hidden"
          aria-label={labels.open}
        >
          <Icon name="menu" className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        onClick={closeOnLinkClick}
        className="w-[min(20rem,calc(100vw-3rem))] border-sidebar-border bg-sidebar text-sidebar-foreground"
      >
        <SheetHeader className="flex h-(--header-height) items-center justify-between gap-2 border-b border-sidebar-border pr-2 pl-4">
          {brand}
          <SheetTitle className="sr-only">{labels.title}</SheetTitle>
          <SheetDescription className="sr-only">
            {labels.description}
          </SheetDescription>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" aria-label={labels.close}>
              <Icon name="close" className="size-5" />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="min-h-0 flex-1 scrollbar-thin overflow-y-auto overscroll-contain py-1">
          {children}
        </div>
        <SheetFooter className="border-t border-sidebar-border p-4">
          {footer}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
