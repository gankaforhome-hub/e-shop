import { type ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

/**
 * Native `<select>` styled like `Input`: short option lists (seasons, statuses) where the
 * platform picker is the most accessible choice and needs no client code.
 */
export function Select({ className, ...props }: ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}
