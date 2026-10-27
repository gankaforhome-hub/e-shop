'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type CartLine } from '@/entities/cart';
import { type Locale } from '@/shared/i18n/routing';

/** A line never drops below 1: only `removeLine` takes it out of the cart. */
export const MIN_LINE_QUANTITY = 1;
export const MAX_LINE_QUANTITY = 99;

type CartState = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeLine: (id: string) => void;
  clear: () => void;
  /** Applies titles in `locale` (keyed by line id); others keep theirs. */
  relocalize: (locale: Locale, titles: Record<string, string>) => void;
};

const clampQuantity = (quantity: number) =>
  Math.min(MAX_LINE_QUANTITY, Math.max(MIN_LINE_QUANTITY, quantity));

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
          lines: state.lines.map(line =>
            line.id === id
              ? { ...line, quantity: clampQuantity(line.quantity + delta) }
              : line,
          ),
        })),
      removeLine: id =>
        set(state => ({ lines: state.lines.filter(line => line.id !== id) })),
      clear: () => set({ lines: [] }),
      relocalize: (locale, titles) =>
        set(state => ({
          lines: state.lines.map(line => ({
            ...line,
            title: titles[line.id] ?? line.title,
            locale,
          })),
        })),
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
