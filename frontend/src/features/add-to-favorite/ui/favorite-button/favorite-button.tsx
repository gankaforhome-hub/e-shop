'use client';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { useFavorite } from '../../model';

interface IFavoriteButton {
  productId: string;
  initialFavorite: boolean;
  className?: string;
}

export function FavoriteButton({
  productId,
  initialFavorite,
  className,
}: IFavoriteButton) {
  const { isFavorite, isPending, toggle } = useFavorite({
    productId,
    initialValue: initialFavorite,
  });

  return (
    <Button
      variant="ghost"
      onClick={toggle}
      disabled={isPending}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={cn('h-8 w-8 rounded-full', className)}
    >
      <Icon
        name="favorite"
        className={cn(
          'custom-transition h-5 w-5 transition-colors',
          isFavorite ? 'fill-brand-primary text-brand-primary' : '',
        )}
      />
    </Button>
  );
}
