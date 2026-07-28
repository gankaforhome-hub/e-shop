'use client';
import { type FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { CarouselCurrent } from '@/shared/ui/carousel';
import { useCarousel } from '@/shared/ui/carousel/core/useCarousel';

interface IBannerPaginationProps {
  className?: string;
  to: number;
}

export const BannerPagination: FC<IBannerPaginationProps> = ({
  className,
  to,
}) => {
  const { current } = useCarousel();
  const isActive = current === to;

  return (
    <>
      <CarouselCurrent
        to={to}
        data-active={isActive}
        className={cn(className)}
      />
    </>
  );
};
