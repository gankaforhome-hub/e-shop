import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface IBoxProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function Box({ children, className, ...rest }: IBoxProps) {
  return (
    <>
      <div className={cn('', className)} {...rest}>
        {children}
      </div>
    </>
  );
}
