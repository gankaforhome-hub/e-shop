'use server';

import { productStore } from '@/entities/product/mock/products';

//INFO only for local mock
const favoriteState = new Map(
  productStore.map(product => [product.id, product.isFavorite ?? false]),
);

export async function toggleFavorite(
  productId: string,
): Promise<{ isFavorite: boolean }> {
  const current = favoriteState.get(productId) ?? false;

  const next = !current;

  favoriteState.set(productId, next);

  return {
    isFavorite: next,
  };
}
