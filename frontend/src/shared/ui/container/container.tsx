import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface IContainerProps {
  children: ReactNode;
  className?: string;
}
//;

export const Container: FC<IContainerProps> = ({ className, children }) => {
  return (
    <div className={cn('fpx-4/20 container mx-auto my-0 w-full', className)}>
      {children}
    </div>
  );
};
