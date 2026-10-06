import { cn, repeat } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

interface ProductSliderSkeletonWithProgressProps {
  count?: number;
  className?: string;
}

export function GankaGallerySkeleton({
  count = 4,
  className,
}: ProductSliderSkeletonWithProgressProps) {
  return (
    <div className={cn('w-full min-w-0', className)}>
      <ul
        className={cn(
          'scrollbar-none flex w-full min-w-0 gap-3 overflow-hidden py-2 sm:gap-4 lg:gap-6',
          'xl:grid xl:grid-cols-4 xl:overflow-visible',
        )}
      >
        {repeat(count).map((_, index) => (
          <li
            key={index}
            className={cn(
              'shrink-0',
              'w-full min-w-full',
              'sm:w-[calc((100%-16px)/2)] sm:min-w-[calc((100%-16px)/2)]',
              'md:w-[calc((100%-16px)/3)] md:min-w-[calc((100%-16px)/3)]',
              'xl:w-auto xl:min-w-0 xl:shrink',
            )}
          >
            <Skeleton className="rounded-card aspect-square w-full" />
          </li>
        ))}
      </ul>

      <div className="mt-3 flex justify-center md:px-20 xl:hidden">
        <Skeleton className="h-0.5 w-full" />
      </div>
    </div>
  );
}
