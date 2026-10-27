'use client';

import { create } from 'zustand';

type CartDrawerState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

/** Drawer visibility, shared so "Add to cart" can slide it open. Not persisted. */
export const useCartDrawerStore = create<CartDrawerState>()(set => ({
  open: false,
  setOpen: open => set({ open }),
}));
