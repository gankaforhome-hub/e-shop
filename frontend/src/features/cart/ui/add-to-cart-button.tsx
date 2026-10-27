'use client';

import { useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { type CartLine } from '@/entities/cart';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { useCartDrawerStore } from '../model/cart-drawer-store';
import { useCartStore } from '../model/cart-store';

/** How long the button keeps its "Added" checkmark. */
const ADDED_FEEDBACK_MS = 1800;

interface AddToCartButtonProps {
  /** Line snapshot to add; `null` when the selected variant can't be bought. */
  line: Omit<CartLine, 'quantity'> | null;
  label: string;
  /** Slide the cart drawer open after adding (off inside other drawers). */
  openCart?: boolean;
  /** `full`: PDP CTA; `small`: compact row action (wishlist drawer). */
  size?: 'full' | 'small';
  /** `default`: filled CTA; `outline`: bordered secondary action. */
  variant?: 'default' | 'outline';
  /** Runs after the line is added, e.g. to drop it from the wishlist. */
  onAdded?: () => void;
  className?: string;
}

export function AddToCartButton({
  line,
  label,
  openCart = true,
  size = 'full',
  variant = 'default',
  onAdded,
  className,
}: AddToCartButtonProps) {
  const t = useTranslations('common.cart');
  const addLine = useCartStore(state => state.addLine);
  const openDrawer = useCartDrawerStore(state => state.setOpen);
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleClick = () => {
    if (!line) {
      return;
    }
    addLine(line);
    if (openCart) {
      openDrawer(true);
    }
    onAdded?.();
    // Repeated clicks restart the checkmark instead of stacking timers
    setAdded(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      disabled={!line}
      onClick={handleClick}
      data-added={added || undefined}
      className={cn(
        'group/add relative shadow-none',
        size === 'full' && 'py-6 text-base',
        className,
      )}
    >
      {/* Both labels share one grid cell: the button never changes size */}
      <span className="grid place-items-center">
        <span className="duration-(--dur-normal) ease-subtle group-data-added/add:-translate-y-1 group-data-added/add:opacity-0 col-start-1 row-start-1 transition-[opacity,transform] motion-reduce:transition-none">
          {label}
        </span>
        <span
          aria-hidden={!added}
          className="duration-(--dur-normal) ease-subtle group-data-added/add:translate-y-0 group-data-added/add:opacity-100 col-start-1 row-start-1 flex translate-y-1 items-center gap-2 opacity-0 transition-[opacity,transform] motion-reduce:transition-none"
        >
          <Icon name="check" className="size-5" aria-hidden="true" />
          {t('added')}
        </span>
      </span>
      <span className="sr-only" aria-live="polite">
        {added ? t('added') : ''}
      </span>
    </Button>
  );
}
