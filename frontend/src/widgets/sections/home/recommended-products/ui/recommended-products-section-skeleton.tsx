import { ProductCardSkeleton } from '@/entities/product';
import { cn, repeat } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';
import { Skeleton } from '@/shared/ui/skeleton';

interface RecommendedProductsSectionSkeletonProps {
  limit?: number;
  className?: string | undefined;
}

export function RecommendedProductsSectionSkeleton({
  limit = 4,
  className,
}: RecommendedProductsSectionSkeletonProps) {
  return (
    <Container className={cn(className)}>
      <ul
        className={cn(
          'scrollbar-none flex w-full min-w-0 gap-3 overflow-hidden py-2 sm:gap-4 xl:gap-6',
          'lg:grid lg:grid-cols-4 lg:overflow-visible',
        )}
      >
        {repeat(limit).map((_, index) => (
          <li
            key={`skeleton-${index}`}
            className={cn(
              'shrink-0 snap-start',
              'w-full',
              'sm:w-[calc((100%-16px)/1.5)]',
              'md:w-[calc((100%-16px)/3)]',
              'lg:w-auto lg:shrink',
            )}
          >
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>

      <div className="mt-3 flex justify-center md:px-20 lg:hidden">
        <Skeleton className="h-0.5 w-full rounded-full" />
      </div>
    </Container>
  );
}
