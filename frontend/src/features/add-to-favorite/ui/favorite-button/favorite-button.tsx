'use client';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { useFavorite } from '../../model';

interface IFavoriteButton {
  productId: string;
  initialFavorite: boolean;
}

export function FavoriteButton({
  productId,
  initialFavorite,
}: IFavoriteButton) {
  const { isFavorite, toggle } = useFavorite({
    productId,
    initialValue: initialFavorite,
  });

  return (
    <>
      <Button
        variant="ghost"
        onClick={toggle}
        aria-label="Add to favorites"
        className="h-8 w-8 rounded-full"
      >
        <Icon
          name="favorite"
          className={cn(
            'h-5 w-5',
            isFavorite ? 'fill-brand-primary text-brand-primary' : '',
          )}
        />
      </Button>
    </>
  );
}
