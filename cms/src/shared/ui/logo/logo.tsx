import { cn } from '@/shared/lib/utils';

import { Icon } from '../icon';

/**
 * Brand mark tile: the storefront logo in black (near-white in dark theme) on
 * a card surface — its fine dots get lost on a solid red tile.
 * Decorative — label its link.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-lg bg-card text-logo shadow-xs ring-1 ring-border',
        className,
      )}
    >
      <Icon name="logo" className="size-[78%]" />
    </span>
  );
}
