import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface ISectionProps {
  className?: string;
  children: ReactNode;
}

export const Section = ({ className, children }: ISectionProps) => {
  return (
    <>
      <section className={cn('w-full', className)}>{children}</section>
    </>
  );
};
