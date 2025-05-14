import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface IContainerProps {
  children: ReactNode;
  className?: string;
}
//;

export const Container: FC<IContainerProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        '@container/main container mx-auto my-0 w-full px-4',
        className,
      )}
    >
      {children}
    </div>
  );
};
// "fluid-padding px-fluid [--fluid-padding-max:3.375] [--fluid-padding-min:1]",
