'use client';

import { useTranslations } from 'next-intl';

import { type CartLine } from '@/entities/cart';
import { cn } from '@/shared/lib/utils';
import { showSuccessBanner } from '@/shared/lib/utils/toast';
import { Button } from '@/shared/ui/button';

import { useCartStore } from '../model/cart-store';

interface AddToCartButtonProps {
  /** Line snapshot to add; `null` when the selected variant can't be bought. */
  line: Omit<CartLine, 'quantity'> | null;
  label: string;
  className?: string;
}

export function AddToCartButton({
  line,
  label,
  className,
}: AddToCartButtonProps) {
  const t = useTranslations('common');
  const addLine = useCartStore(state => state.addLine);

  const handleClick = () => {
    if (!line) {
      return;
    }
    addLine(line);
    showSuccessBanner({
      message: t('cart.added'),
      closeLabel: t('common.aria.close'),
    });
  };

  return (
    <Button
      type="button"
      size="full"
      disabled={!line}
      onClick={handleClick}
      className={cn('py-6 text-base shadow-none', className)}
    >
      {label}
    </Button>
  );
}
