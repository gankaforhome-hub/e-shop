import { cn } from 'src/shared/lib/utils';

export const CollectionCardSkeleton = () => {
  const skeleton =
    'animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800';
  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className={cn('bg-muted h-105 w-full rounded-2xl', skeleton)} />

      <div
        className={cn('bg-muted mt-8 h-8 w-40 animate-pulse rounded', skeleton)}
      />
    </div>
  );
};
