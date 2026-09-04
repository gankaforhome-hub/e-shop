import { cn, repeat } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

interface IProductTypeListSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductTypeListSkeleton({
  count = 6,
  className,
}: IProductTypeListSkeletonProps) {
  return (
    <div className={cn('w-full min-w-0', className)}>
      <ul className="scrollbar-none flex w-full min-w-0 justify-start gap-3 overflow-hidden py-2 sm:gap-4 lg:gap-6">
        {repeat(count).map((_, index) => (
          <li
            key={index}
            className="flex w-[calc((100%-24px)/3)] shrink-0 justify-center sm:w-auto"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <Skeleton className="h-20 w-20 rounded-full sm:h-28 sm:w-28 lg:h-36 lg:w-36 xl:h-40 xl:w-40" />
              <Skeleton className="h-4 w-16 sm:h-5 sm:w-20 lg:h-6 lg:w-24" />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex h-6 items-center justify-center gap-2">
        {repeat(3).map((_, index) => (
          <Skeleton key={index} className="h-2.5 w-2.5 rounded-full" />
        ))}
      </div>
    </div>
  );
}
