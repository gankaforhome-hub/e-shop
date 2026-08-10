import { cn } from '@/shared/lib/utils';

interface IHeaderSpacerProps {
  className?: string;
}

export function HeaderSpacer({ className }: IHeaderSpacerProps) {
  return (
    <div
      className={cn('h-30 shrink-0 lg:h-40', className)}
      aria-hidden="true"
    />
  );
}
