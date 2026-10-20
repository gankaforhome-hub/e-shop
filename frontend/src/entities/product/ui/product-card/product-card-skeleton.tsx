import { Skeleton } from '@/shared/ui/skeleton';

/**
 * Mirrors `ProductCard` box by box: square media, then the details block
 * with the same paddings and gaps. Each text bar sits in a wrapper with the
 * card's typography and is `1lh` tall, so it takes exactly the height of the
 * real line on every breakpoint (no layout shift on swap).
 */
export function ProductCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="font-caption flex h-full flex-col overflow-hidden"
    >
      <Skeleton className="aspect-square w-full rounded-none" />

      <div className="flex flex-1 flex-col justify-between gap-1 p-2 pt-1">
        <div className="flex flex-col gap-1">
          {/* Collection */}
          <div className="text-xs">
            <Skeleton className="h-[1lh] w-1/3 rounded-sm" />
          </div>
          {/* Title: two lines (line-clamp-2) */}
          <div className="text-sm leading-snug tracking-wide md:text-base">
            <Skeleton className="h-[1lh] w-full rounded-sm" />
            <Skeleton className="h-[1lh] w-3/4 rounded-sm" />
          </div>
        </div>
        {/* Price */}
        <div className="text-sm md:text-base">
          <Skeleton className="h-[1lh] w-20 rounded-sm" />
        </div>
      </div>
    </article>
  );
}
