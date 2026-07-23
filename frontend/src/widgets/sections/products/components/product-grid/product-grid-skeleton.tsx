import { ProductCardSkeleton } from '@/entities/product';
import { repeat } from '@/shared/lib/utils';

interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGridSkeleton = ({
  count = 4,
}: ProductGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {repeat(count).map((_, i) => (
        <ProductCardSkeleton key={`skeleton - ${i}`} />
      ))}
    </div>
  );
};
