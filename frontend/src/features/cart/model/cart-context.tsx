'use client';

import React, {
  createContext,
  useContext,
  useOptimistic,
  useTransition,
} from 'react';

import { type CartItem } from './types';
import { removeItemAction, updateQuantityAction } from '../api/cart-actions';

interface CartContextType {
  cartItems: CartItem[];
  isPending: boolean;
  totalQuantity: number;
  totalAmount: number;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

type OptimisticAction =
  | { type: 'UPDATE_QTY'; id: string; delta: number }
  | { type: 'REMOVE'; id: string };

export function CartProvider({
  initialItems,
  children,
}: {
  initialItems: CartItem[];
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();

  // Оптимістичний стан React 19
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    initialItems,
    (state: CartItem[], action: OptimisticAction) => {
      switch (action.type) {
        case 'UPDATE_QTY':
          return state
            .map(item => {
              if (item.id === action.id) {
                const newQty = item.quantity + action.delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];
        case 'REMOVE':
          return state.filter(item => item.id !== action.id);
        default:
          return state;
      }
    },
  );

  const updateQuantity = (id: string, delta: number) => {
    startTransition(async () => {
      setOptimisticItems({ type: 'UPDATE_QTY', id, delta });
      await updateQuantityAction(id, delta);
    });
  };

  const removeItem = (id: string) => {
    startTransition(async () => {
      setOptimisticItems({ type: 'REMOVE', id });
      await removeItemAction(id);
    });
  };

  const totalQuantity = optimisticItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const totalAmount = optimisticItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: optimisticItems,
        isPending,
        totalQuantity,
        totalAmount,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
