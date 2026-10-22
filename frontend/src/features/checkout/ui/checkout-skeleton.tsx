import { Skeleton } from '@/shared/ui/skeleton';

const FIELD_ROWS = 2;

/** Mirrors `CheckoutForm`'s grid while the persisted cart rehydrates. */
export function CheckoutSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] lg:gap-12 xl:gap-20"
    >
      <div className="flex min-w-0 flex-col gap-10 md:gap-12">
        <Skeleton className="h-11 w-full rounded-lg md:h-12" />
        {Array.from({ length: 2 }, (_, section) => (
          <div key={section} className="flex flex-col gap-5">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              {Array.from({ length: FIELD_ROWS * 2 }, (_, field) => (
                <div key={field} className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-13 w-full rounded-md lg:h-14" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-border flex flex-col gap-5 rounded-lg border p-5 md:p-6">
        <Skeleton className="h-6 w-36" />
        {Array.from({ length: 2 }, (_, line) => (
          <div key={line} className="flex items-center gap-4">
            <Skeleton className="size-16 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}
