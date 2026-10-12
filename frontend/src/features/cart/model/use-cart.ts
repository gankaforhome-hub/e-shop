'use client';

import { useEffect } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { getCartTotals } from '@/entities/cart';

import { useCartStore } from './cart-store';

/** Restores the persisted cart from localStorage once on the client. */
export function useCartRehydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
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
