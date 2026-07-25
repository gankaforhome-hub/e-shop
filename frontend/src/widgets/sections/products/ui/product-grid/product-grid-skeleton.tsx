import { ProductCardSkeleton } from '@/entities/product';
import { repeat } from '@/shared/lib/utils';

interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGridSkeleton = ({
  count = 4,
}: ProductGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {repeat(count).map((_, index) => {
        const isThird = (index + 1) % 3 === 0;
        const isLast = index === count - 1;
        const isLastAlone = isLast && count % 3 === 1;

        return (
          <div
            key={`skeleton-${index}`}
            className={isThird || isLastAlone ? 'max-sm:col-span-2' : ''}
          >
            <ProductCardSkeleton />
          </div>
        );
      })}
    </div>
  );
};
