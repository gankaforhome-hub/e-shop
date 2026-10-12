'use client';

import { useOptimistic, useTransition } from 'react';

import { toggleFavorite } from '../api';

type UseFavoriteParams = {
  productId: string;
  initialValue: boolean;
};

/**
 * Optimistic favorite toggle. The server action rewrites the cookie, which
 * re-renders the route and delivers the confirmed `initialValue`; on failure
 * the optimistic value reverts automatically when the transition ends.
 */
export function useFavorite({ productId, initialValue }: UseFavoriteParams) {
  const [isFavorite, setOptimisticFavorite] = useOptimistic(initialValue);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      setOptimisticFavorite(!isFavorite);
      try {
        await toggleFavorite(productId);
      } catch {
        // Optimistic state rolls back to `initialValue` on its own
      }
    });
  };

  return { isFavorite, isPending, toggle };
}
