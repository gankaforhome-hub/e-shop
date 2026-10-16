import { type ReactNode } from 'react';

import { Skeleton } from '@/shared/ui/skeleton';

interface CatalogToolbarSkeletonProps {
  /** Category chips for the `lg+` centre slot (same markup as the real bar). */
  categoryBar: ReactNode;
}

/** Mirrors `CatalogToolbar`: filter + count · categories · sort (`lg+`), filter · count · sort below. */
export function CatalogToolbarSkeleton({
  categoryBar,
}: CatalogToolbarSkeletonProps) {
  return (
    <div className="px-4 pb-6">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8">
        <div
          aria-hidden="true"
          className="flex items-center gap-6 justify-self-start"
        >
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-4 w-20 max-lg:hidden" />
        </div>
        <Skeleton aria-hidden="true" className="h-4 w-20 lg:hidden" />
        <div className="max-lg:hidden">{categoryBar}</div>
        <Skeleton
          aria-hidden="true"
          className="h-9 w-32 justify-self-end sm:w-52"
        />
      </div>
    </div>
  );
}
