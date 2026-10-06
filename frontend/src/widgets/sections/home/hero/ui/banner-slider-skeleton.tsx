import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

export const BannerSliderSkeleton = () => {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-stone-200/40 backdrop-blur-3xl dark:bg-stone-900/40',
        'h-[calc(640px-var(--h-topbar))] md:h-[calc(100dvh-var(--h-topbar))] landscape:max-md:h-80',
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-1/4 h-72 w-72 animate-pulse rounded-full bg-amber-200/50 opacity-70 blur-2xl dark:bg-amber-800/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 right-10 h-80 w-80 animate-pulse rounded-full bg-stone-300/60 opacity-70 blur-2xl dark:bg-stone-700/40"
      />

      <div className="absolute inset-x-0 bottom-20 z-10 mx-auto flex max-w-xl flex-col items-center justify-end gap-3.5 px-4">
        <Skeleton className="h-3.5 w-28 rounded-full bg-stone-400/40 dark:bg-stone-600/40" />
        <Skeleton className="h-9 w-3/4 max-w-xs rounded-xl bg-stone-400/50 dark:bg-stone-600/50" />
        <Skeleton className="mt-2 h-11 w-36 rounded-full bg-stone-500/50 dark:bg-stone-500/50" />
      </div>
    </div>
  );
};
