'use client';
import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { CarouselCurrent } from '@/shared/ui/carousel';
import { useCarousel } from '@/shared/ui/carousel/useCarousel';

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
        className={cn(
          'bg-bg-muted custom-transition inline-flex h-1 w-6 rounded-full transition-all',
          isActive
            ? 'from-bg to-bg-muted w-12.5 bg-gradient-to-r from-60% to-40%'
            : 'bg-bg-muted w-6',
          className,
        )}
      />
    </>
  );
};
