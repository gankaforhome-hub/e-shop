'use client';

import { useEffect, useSyncExternalStore } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { getCartTotals } from '@/entities/cart';

import { useCartStore } from './cart-store';

/** Restores the persisted cart from localStorage once on the client. */
export function useCartRehydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
}

const subscribeHydration = (onChange: () => void) =>
  useCartStore.persist.onFinishHydration(onChange);

/** `false` on the server and until the persisted cart is restored. */
export function useCartHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}

export function useCart() {
  const { lines, addLine, updateQuantity, removeLine, clear } = useCartStore(
    useShallow(state => ({
      lines: state.lines,
      addLine: state.addLine,
      updateQuantity: state.updateQuantity,
      removeLine: state.removeLine,
      clear: state.clear,
    })),
  );

  return {
    lines,
    ...getCartTotals(lines),
    addLine,
    updateQuantity,
    removeLine,
    clear,
  };
}
