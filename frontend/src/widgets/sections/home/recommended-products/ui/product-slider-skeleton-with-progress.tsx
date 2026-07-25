import { ProductCardSkeleton } from '@/entities/product';
import { repeat } from '@/shared/lib/utils';

interface ProductSliderSkeletonProps {
  count?: number;
}

export function ProductSliderSkeletonWithProgress({
  count = 4,
}: ProductSliderSkeletonProps) {
  return (
    <div className="w-full">
      <div className="-mx-2 flex overflow-hidden px-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {repeat(count).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className={`w-full min-w-full shrink-0 sm:w-auto sm:min-w-0 sm:shrink ${index > 0 ? 'hidden sm:block' : ''} `}
          >
            <ProductCardSkeleton />
          </div>
        ))}
      </div>

      <div className="mt-2 px-4 sm:hidden">
        <div className="h-0.5 w-full animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
