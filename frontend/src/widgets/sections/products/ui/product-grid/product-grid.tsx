import { Suspense } from 'react';

import { ProductCard } from '@/entities/product';
import { type ProductCardDTO } from '@/entities/product/model/types';
import { FavoriteButton } from '@/features/add-to-favorite';

import { ProductGridSkeleton } from './product-grid-skeleton';

interface IProductGridProps {
  products: ProductCardDTO[];
  limit?: number;
  className?: string;
  isMasonry?: boolean;
}

export function ProductGrid({
  products,
  limit = 4,
  className = '',
  isMasonry = false,
}: IProductGridProps) {
  const visibleProducts = limit ? products.slice(0, limit) : products;

  if (!visibleProducts.length) {
    return null;
  }

  return (
    <Suspense fallback={<ProductGridSkeleton count={limit} />}>
      <ul
        className={`grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-4 ${className}`}
      >
        {visibleProducts.map((product, index) => {
          const isThird = (index + 1) % 3 === 0;
          const isLast = index === visibleProducts.length - 1;
          const isLastAlone = isLast && visibleProducts.length % 3 === 1;
          return (
            <li
              key={product.id}
              className={
                isMasonry || isThird || isLastAlone ? 'max-sm:col-span-2' : ''
              }
            >
              <ProductCard
                product={product}
                priority={index < 9}
                favoriteButton={
                  <FavoriteButton
                    productId={product.id}
                    initialFavorite={product.isFavorite}
                  />
                }
              />
            </li>
          );
        })}
      </ul>
    </Suspense>
  );
}
