import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

export const CollectionCardSkeleton = () => {
  return (
    <div className={cn('h-full w-full flex-col items-center justify-center')}>
      <div className="aspect-570/585 relative w-full overflow-hidden">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      </div>

      <Skeleton className="mx-auto mt-4 h-5 w-[70%] lg:mt-6" />
    </div>
  );
};
