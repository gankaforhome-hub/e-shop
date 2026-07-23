'use client';

import { useState, useTransition } from 'react';

import { toggleFavorite } from '../api/toggle-favorite';

type UseFavoriteParams = {
  productId: string;
  initialValue: boolean;
};

export function useFavorite({ productId, initialValue }: UseFavoriteParams) {
  const [isFavorite, setIsFavorite] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const optimistic = !isFavorite;

    setIsFavorite(optimistic);

    startTransition(async () => {
      try {
        const result = await toggleFavorite(productId);
        setIsFavorite(result.isFavorite);
      } catch {
        setIsFavorite(!optimistic);
      }
    });
  };

  return {
    isFavorite,
    isPending,
    toggle,
  };
}
