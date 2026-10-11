import { cn } from '@/shared/lib/utils';

interface IBurgerIconProps {
  isOpen: boolean;
  className?: string;
}

export function BurgerIcon({ isOpen, className }: IBurgerIconProps) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <span
        className={cn(
          'custom-transition bg-icon group-hover:bg-icon-hover absolute h-0.5 transition-all',
          isOpen ? 'w-4/5 translate-y-0 rotate-45' : '-translate-y-1.25 w-full',
        )}
      />
      <span
        className={cn(
          'custom-transition bg-icon group-hover:bg-icon-hover absolute h-0.5 transition-all',
          isOpen ? 'scale-0 opacity-0' : 'w-full scale-100 opacity-100',
        )}
      />
      <span
        className={cn(
          'custom-transition bg-icon group-hover:bg-icon-hover absolute h-0.5 transition-all',
          isOpen ? 'w-4/5 translate-y-0 -rotate-45' : 'translate-y-1.25 w-full',
        )}
      />
    </div>
  );
}
