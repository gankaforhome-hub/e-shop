import { cn } from '@/shared/lib/utils';

import { getInitials } from '../lib/get-initials';

/** Initials badge; decorative — the name is always available as text nearby. */
export function UserAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground-emphasis ring-1 ring-border select-none',
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
