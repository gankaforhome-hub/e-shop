import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface IContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ className, children }: IContainerProps) {
  return (
    <div
      className={cn(
        '3xl:px-20 container mx-auto my-0 w-full px-4 md:px-5 lg:px-8 xl:px-10',
        className,
      )}
    >
      {children}
    </div>
  );
}
