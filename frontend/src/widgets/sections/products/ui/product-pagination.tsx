'use client';
import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { CarouselCurrent } from '@/shared/ui/carousel';
import { useCarousel } from '@/shared/ui/carousel/useCarousel';

interface IProductPaginationProps {
  className?: string;
  to: number;
}

export const ProductPagination: FC<IProductPaginationProps> = ({
  className,
  to,
}) => {
  const { current } = useCarousel();
  const isActive = current === to;
  console.log(current);

  return (
    <>
      <CarouselCurrent
        to={to}
        className={cn(
          'custom-transition h-1 flex-1 rounded-full p-0 transition-all',
          isActive ? 'bg-btn-bg-secondary' : 'bg-btn-bg-secondary/15',
          className,
        )}
      />
    </>
  );
};
