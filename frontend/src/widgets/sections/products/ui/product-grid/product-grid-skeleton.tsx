import { ProductCardSkeleton } from '@/entities/product';
import { repeat } from '@/shared/lib/utils';

import {
  getProductGridItemClassName,
  productGridClassName,
} from './product-grid-layout';

interface ProductGridSkeletonProps {
  count?: number;
}

/** Same tracks and item spans as `ProductGrid` on every viewport. */
export function ProductGridSkeleton({ count = 4 }: ProductGridSkeletonProps) {
  return (
    <div aria-hidden="true" className={productGridClassName}>
      {repeat(count).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className={getProductGridItemClassName(index, count)}
        >
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}
