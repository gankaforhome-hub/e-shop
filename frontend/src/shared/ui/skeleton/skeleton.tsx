import { cn } from '@/shared/lib/utils';

interface ISkeletonProps {
  className?: string;
}

export function Skeleton({ className }: ISkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/60',
        className,
      )}
    />
  );
}
