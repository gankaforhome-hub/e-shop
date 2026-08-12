import { cn } from '@/shared/lib/utils';

interface IHeaderSpacerProps {
  className?: string;
}

export function HeaderSpacer({ className }: IHeaderSpacerProps) {
  return (
    <div
      className={cn(
        'h-(--h-header-mobile) md:h-(--h-header-tab) lg:h-(--h-header-desktop) shrink-0',
        className,
      )}
      aria-hidden="true"
    />
  );
}
