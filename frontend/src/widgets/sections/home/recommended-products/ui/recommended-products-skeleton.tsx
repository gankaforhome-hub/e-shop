import { ProductCardSkeleton } from '@/entities/product';
import { cn, repeat } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

interface ProductSliderSkeletonProps {
  count?: number;
  className?: string | undefined;
}

export function RecommendedProductsSkeleton({
  count = 4,
  className,
}: ProductSliderSkeletonProps) {
  return (
    <div className={cn('w-full min-w-0', className)}>
      <ul
        className={cn(
          'scrollbar-none flex w-full min-w-0 gap-3 overflow-hidden py-2 sm:gap-4 lg:gap-6',
          'lg:grid lg:grid-cols-4 lg:overflow-visible',
        )}
      >
        {repeat(count).map((_, index) => (
          <li
            key={`skeleton-${index}`}
            className={cn(
              'shrink-0',
              'w-full min-w-full',
              'sm:w-[calc((100%-16px)/1.5)] sm:min-w-[calc((100%-16px)/1.5)]',
              'lg:w-auto lg:min-w-0 lg:shrink',
            )}
          >
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>

      <div className="mt-3 flex justify-center md:px-20 lg:hidden">
        <Skeleton className="h-0.5 w-full rounded-full" />
      </div>
    </div>
  );
}
