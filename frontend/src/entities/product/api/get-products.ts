'use server';
import { cookies } from 'next/headers';

import { MOCK_PRODUCTS } from '../mock/products';
import { type ProductCardDTO } from '../model/types';

import { mapProductToCard } from './product-mapper';

interface GetProductsParams {
  search?: string;
  category?: string;
  favoritesOnly?: string;
}

export async function getProducts(
  params: GetProductsParams,
): Promise<ProductCardDTO[]> {
  const cookieStore = await cookies();
  const favoritesRaw = cookieStore.get('favorite_ids')?.value;
  // Secure cookie parsing to prevent fatal errors
  let parsedFavorites: string[] = [];
  if (favoritesRaw) {
    try {
      parsedFavorites = JSON.parse(favoritesRaw);
    } catch {
      parsedFavorites = [];
    }
  }

  const favoriteIds = new Set<string>(parsedFavorites);

  let filtered = [...MOCK_PRODUCTS];

  // 1. Filtering by search query (search)
  if (params.search) {
    const query = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      p =>
        p.title.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query),
    );
  }

  // 2. Filter by category
  if (params.category) {
    const categoryQuery = params.category.toLowerCase();
    filtered = filtered.filter(p => {
      if (!p.category) {
        return false;
      }

      if (typeof p.category === 'object') {
        return (
          p.category.slug?.toLowerCase() === categoryQuery ||
          p.category.id?.toLowerCase() === categoryQuery
        );
      }

      return String(p.category).toLowerCase() === categoryQuery;
    });
  }

  // 3. "Only Favorites" Filter
  if (params.favoritesOnly === 'true') {
    filtered = filtered.filter(p => favoriteIds.has(p.id));
  }

  // 4. Мапимо товари та збагачуємо актуальним isFavorite з cookie
  return filtered.map(product => {
    const card = mapProductToCard(product);
    return {
      ...card,
      isFavorite: favoriteIds.has(product.id),
    };
  });
}
