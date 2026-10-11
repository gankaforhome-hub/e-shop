import { Skeleton } from '@/shared/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <article className="flex h-full animate-pulse flex-col overflow-hidden">
      {/* Square image */}
      <Skeleton className="aspect-square w-full" />

      {/* Content below image */}
      <div className="flex flex-1 flex-col justify-between gap-1 p-2 pt-2">
        <div className="flex flex-col gap-1.5">
          {/* Категорія */}
          <Skeleton className="h-3 w-1/3" />

          {/* Product name (2 lines to simulate line-clamp-2) */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Price and status */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </article>
  );
}
