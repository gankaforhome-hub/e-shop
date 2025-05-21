'use client';
import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { CarouselCurrent } from '@/shared/ui/carousel';
import { useCarousel } from '@/shared/ui/carousel/useCarousel';

interface IProductsPaginationProps {
  className?: string;
  to: number;
}

export const ProductsPagination: FC<IProductsPaginationProps> = ({
  className,
  to,
}) => {
  const { current } = useCarousel();
  const isActive = current === to;

  return (
    <>
      <CarouselCurrent
        to={to}
        className={cn(
          'custom-transition flex size-2 rounded-full transition-all',
          isActive ? 'bg-btn-bg-secondary' : 'bg-btn-bg-secondary/15',
          className,
        )}
      />
    </>
  );
};
