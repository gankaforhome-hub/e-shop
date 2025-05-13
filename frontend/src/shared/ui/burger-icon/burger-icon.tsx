import { FC } from 'react';

import { cn } from '@/shared/lib/utils';

interface IBurgerIconProps {
  isOpen: boolean;
}

export const BurgerIcon: FC<IBurgerIconProps> = ({ isOpen }) => {
  return (
    <div className="relative flex h-6 w-6 items-center justify-center">
      <span
        className={cn(
          'custom-transition absolute h-0.5 w-5 bg-black transition-transform',
          isOpen ? 'translate-y-0 rotate-45' : '-translate-y-2',
        )}
      />
      <span
        className={cn(
          'custom-transition absolute h-0.5 w-5 bg-black transition-all',
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
        )}
      />
      <span
        className={cn(
          'custom-transition absolute h-0.5 w-5 bg-black transition-transform',
          isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-2',
        )}
      />
    </div>
  );
};
