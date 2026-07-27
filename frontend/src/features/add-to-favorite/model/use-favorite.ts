'use client';

import { useEffect, useState, useTransition } from 'react';

import { toggleFavorite } from '../api';

type UseFavoriteParams = {
  productId: string;
  initialValue: boolean;
};

export function useFavorite({ productId, initialValue }: UseFavoriteParams) {
  const [isFavorite, setIsFavorite] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  // We synchronize the local state when changing the initial Value from the server (for example, when revalidating Path)
  useEffect(() => {
    setIsFavorite(initialValue);
  }, [initialValue]);

  const toggle = () => {
    // We remember the state BEFORE the change for a possible rollback
    const previousState = isFavorite;
    const nextState = !isFavorite;

    // 1. We optimistically change the state in the UI
    setIsFavorite(nextState);

    // 2. Call Server Action
    startTransition(() => {
      toggleFavorite(productId).catch(error => {
        // У разі помилки повертаємо попередній стан
        setIsFavorite(previousState);
        console.error('Failed to toggle favorite:', error);
      });
    });
  };

  return {
    isFavorite,
    isPending,
    toggle,
  };
}
