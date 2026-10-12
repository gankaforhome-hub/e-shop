import { getProducts, type GetProductsParams } from '@/entities/product';
import {
  getFavoriteIds,
  withFavorites,
} from '@/features/add-to-favorite/server';

import { ProductGrid } from './product-grid';

interface ProductGridLoaderProps {
  query: GetProductsParams;
  limit?: number;
}

/**
 * Fetches a cached catalog slice and merges the request-time favorites cookie.
 * Render inside `<Suspense fallback={<ProductGridSkeleton />}>`.
 */
export async function ProductGridLoader({
  query,
  limit,
}: ProductGridLoaderProps) {
  const [{ data }, favoriteIds] = await Promise.all([
    getProducts(query),
    getFavoriteIds(),
  ]);

  return (
    <ProductGrid
      products={withFavorites(data, favoriteIds)}
      lang={query.lang}
      {...(limit !== undefined && { limit })}
    />
  );
}
