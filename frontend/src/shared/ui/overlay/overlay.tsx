import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';

interface IOverlayProps {
  className?: string;
}

export const Overlay: FC<IOverlayProps> = ({ className }) => {
  return (
    <Box
      className={cn(
        'custom-transition absolute inset-0 z-0 bg-[linear-gradient(rgba(47,48,58,0.3),rgba(47,48,58,0.3))] transition-opacity',
        className,
      )}
    />
  );
};
//
