'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { useFavorite } from '../../model';

interface FavoriteButtonProps {
  productId: string;
  initialFavorite: boolean;
  className?: string;
}

export function FavoriteButton({
  productId,
  initialFavorite,
  className,
}: FavoriteButtonProps) {
  const t = useTranslations('common.common.aria');
  const { isFavorite, isPending, toggle } = useFavorite({
    productId,
    initialValue: initialFavorite,
  });

  return (
    <Button
      variant="iconSecondary"
      size="icon"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
      className={cn('h-8 w-8 rounded-full', className)}
    >
      <Icon
        name="favorite"
        className={cn(
          'custom-transition h-5 w-5 transition-all',
          isFavorite ? 'fill-action-primary text-action-primary' : '',
          'group-hover:scale-105',
        )}
      />
    </Button>
  );
}
