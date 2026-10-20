import { ProductCard, type ProductCardDTO } from '@/entities/product';
import { FavoriteButton } from '@/features/add-to-favorite';
import { type Locale } from '@/shared/i18n/routing';
import { cn } from '@/shared/lib/utils';

import {
  getProductGridItemClassName,
  productGridClassName,
} from './product-grid-layout';

interface IProductGridProps {
  products: ProductCardDTO[];
  limit?: number;
  className?: string;
  lang: Locale;
  isMasonry?: boolean;
}

export function ProductGrid({
  products,
  limit = 4,
  lang,
  className = '',
  isMasonry = false,
}: IProductGridProps) {
  const visibleProducts = limit ? products.slice(0, limit) : products;

  if (!visibleProducts.length) {
    return null;
  }

  return (
    <ul className={cn(productGridClassName, className)}>
      {visibleProducts.map((product, index) => {
        return (
          <li
            key={product.id}
            className={getProductGridItemClassName(
              index,
              visibleProducts.length,
              isMasonry,
            )}
          >
            <ProductCard
              product={product}
              priority={index < 2}
              lang={lang}
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
  );
}
