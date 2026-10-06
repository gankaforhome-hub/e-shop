'use server';

import { type CartItem } from '../model/types';

// Імітація збереженого стан кошика на сервері
let mockServerCart: CartItem[] = [
  {
    id: 'c1',
    productId: 'p1',
    title: 'Керамічна чашка "Світанок"',
    price: 450,
    quantity: 5,
    image: '/images/products/p-eggplant.webp',
  },
  {
    id: 'c2',
    productId: 'p2',
    title: 'Керамічна чашка "Світанок"',
    price: 450,
    quantity: 5,
    image: '/images/products/p-eggplant.webp',
  },
  {
    id: 'c3',
    productId: 'p3',
    title: 'Керамічна чашка "Світанок"',
    price: 450,
    quantity: 5,
    image: '/images/products/p-eggplant.webp',
  },
];

export async function getCartAction(): Promise<CartItem[]> {
  // Імітація мережевої затримки
  await new Promise(res => setTimeout(res, 600));
  return mockServerCart;
}

export async function updateQuantityAction(
  id: string,
  delta: number,
): Promise<CartItem[]> {
  await new Promise(res => setTimeout(res, 400));

  mockServerCart = mockServerCart
    .map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    })
    .filter(Boolean) as CartItem[];

  return mockServerCart;
}

export async function removeItemAction(id: string): Promise<CartItem[]> {
  await new Promise(res => setTimeout(res, 300));
  mockServerCart = mockServerCart.filter(item => item.id !== id);
  return mockServerCart;
}
