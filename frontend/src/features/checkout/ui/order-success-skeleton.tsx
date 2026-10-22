import { Skeleton } from '@/shared/ui/skeleton';

/** Mirrors `OrderSuccess` above the details card while `?order=` resolves. */
export function OrderSuccessSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8"
    >
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="h-9 w-48 rounded-full" />
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-8 w-40 md:h-9" />
          <Skeleton className="h-6 w-72 max-w-full xl:h-7" />
          <Skeleton className="h-6 w-56 max-w-full xl:h-7" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-7 w-40" />
        </div>
      </div>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Skeleton className="sm:w-75 h-14 w-full" />
        <Skeleton className="sm:w-75 h-14 w-full" />
      </div>
    </div>
  );
}
