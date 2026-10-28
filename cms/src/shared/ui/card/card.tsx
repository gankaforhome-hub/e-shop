import { type ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs',
        className,
      )}
      {...props}
    />
  );
}
