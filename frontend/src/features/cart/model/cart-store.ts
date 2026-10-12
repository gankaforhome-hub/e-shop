'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type CartLine } from '@/entities/cart';

const MAX_LINE_QUANTITY = 99;

type CartState = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeLine: (id: string) => void;
  clear: () => void;
};

const clampQuantity = (quantity: number) =>
  Math.min(MAX_LINE_QUANTITY, Math.max(0, quantity));

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      lines: [],
      addLine: (line, quantity = 1) =>
        set(state => {
          const existing = state.lines.find(l => l.id === line.id);
          if (!existing) {
            return {
              lines: [
                ...state.lines,
                { ...line, quantity: clampQuantity(quantity) },
              ],
            };
          }
          return {
            lines: state.lines.map(l =>
              l.id === line.id
                ? { ...l, quantity: clampQuantity(l.quantity + quantity) }
                : l,
            ),
          };
        }),
      updateQuantity: (id, delta) =>
        set(state => ({
          lines: state.lines.flatMap(line => {
            if (line.id !== id) {
              return [line];
            }
            const quantity = clampQuantity(line.quantity + delta);
            return quantity > 0 ? [{ ...line, quantity }] : [];
          }),
        })),
      removeLine: id =>
        set(state => ({ lines: state.lines.filter(line => line.id !== id) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: 'ganka-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ lines: state.lines }),
      // Rehydrated explicitly after mount so SSR and the first client render match
      skipHydration: true,
    },
  ),
);
