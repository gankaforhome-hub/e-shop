'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { useFavorite } from '../../model';

interface FavoriteButtonProps {
  productId: string;
  initialFavorite: boolean;
  /** `overlay`: small glass button on a card image; `action`: outlined
   *  square beside a purchase button, as tall as it. */
  appearance?: 'overlay' | 'action';
  className?: string;
}

export function FavoriteButton({
  productId,
  initialFavorite,
  appearance = 'overlay',
  className,
}: FavoriteButtonProps) {
  const t = useTranslations('common.common.aria');
  const { isFavorite, isPending, toggle } = useFavorite({
    productId,
    initialValue: initialFavorite,
  });
  const isAction = appearance === 'action';

  return (
    <Button
      variant={isAction ? 'outline' : 'iconSecondary'}
      size={isAction ? 'iconBlock' : 'icon'}
      onClick={toggle}
      disabled={isPending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
      className={cn(!isAction && 'h-8 w-8 rounded-full', 'group', className)}
    >
      <Icon
        name="favorite"
        className={cn(
          'custom-transition transition-all',
          isAction ? 'size-5 md:size-6' : 'h-5 w-5',
          isFavorite ? 'fill-action-primary text-action-primary' : '',
          'group-hover:scale-105',
        )}
      />
    </Button>
  );
}
