import { Skeleton } from '@/shared/ui/skeleton';

/**
 * Mirrors `CatalogToolbar`: Filter · Sort, plus the count from `md`
 * (icons below 340px).
 */
export function CatalogToolbarSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex w-full items-center justify-between gap-2 overflow-hidden px-4 pb-3 pt-1 md:gap-4 md:pb-5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="h-9 w-24 max-[339px]:w-9" />
        <Skeleton className="h-4 w-24 max-md:hidden" />
      </div>
      <Skeleton className="h-9 w-24 shrink-0 max-[339px]:w-9 sm:w-52" />
    </div>
  );
}
