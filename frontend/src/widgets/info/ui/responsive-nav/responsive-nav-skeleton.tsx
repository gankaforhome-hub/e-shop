import { Skeleton } from '@/shared/ui/skeleton';

const ITEMS_COUNT = 6;

/** Mirrors `ResponsiveNav`: dropdown trigger below `lg`, link column on `lg+`. */
export function ResponsiveNavSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="border-border h-15.5 rounded-lg border lg:hidden" />
      <div className="max-lg:hidden lg:flex lg:flex-col lg:gap-4">
        {Array.from({ length: ITEMS_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-5 w-40 last:w-32" />
        ))}
      </div>
    </div>
  );
}
