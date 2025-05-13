import { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface ISectionProps {
  className?: string;
  children: ReactNode;
}

export const Section = ({ className, children }: ISectionProps) => {
  return (
    <>
      <section className={cn('h-full w-full', className)}>{children}</section>
    </>
  );
};
