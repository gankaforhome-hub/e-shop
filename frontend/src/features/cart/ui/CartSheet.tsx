'use client';

import { useState } from 'react';

import { Button } from '@/shared/ui/button';

import { CartItemCard } from './CartItem';
import { useCart } from '../model/cart-context';

export function CartSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, totalQuantity, totalAmount, isPending } = useCart();

  return (
    <>
      {/* Кнопка відкриття кошика у Хедері */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-700 transition hover:text-black"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        {totalQuantity > 0 && (
          <span className="bg-accent-foreground absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
            {totalQuantity}
          </span>
        )}
      </button>

      {/* Drawer / Sheet Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="animate-in slide-in-from-right relative z-10 flex h-full w-full max-w-md flex-col shadow-2xl duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Кошик</h2>
                {isPending && (
                  <span className="animate-pulse text-xs text-amber-600">
                    Оновлення...
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 transition hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <p>Ваш кошик порожній</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <CartItemCard key={item.id} item={item} />
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="space-y-4 border-t bg-gray-50 p-4">
                <div className="flex items-center justify-between text-base font-medium text-gray-900">
                  <span>Разом:</span>
                  <span className="text-xl font-bold">{totalAmount} ₴</span>
                </div>
                <Button
                  className="w-full py-3 font-medium shadow-sm"
                  onClick={() => alert('Перехід до оформлення')}
                >
                  Оформити замовлення
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
