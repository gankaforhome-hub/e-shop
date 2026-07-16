'use client';
import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { CarouselCurrent } from '@/shared/ui/carousel';
import { useCarousel } from '@/shared/ui/carousel/useCarousel';

interface IGalleryPaginationProps {
  className?: string;
  to: number;
  dotsType?: 'primary' | 'secondary';
}

export const GalleryPagination: FC<IGalleryPaginationProps> = ({
  className,
  to,
  dotsType = 'primary',
}) => {
  const { current } = useCarousel();
  const isActive = current === to;

  return (
    <>
      <CarouselCurrent
        variant={dotsType === 'primary' ? 'dot' : 'dotSecondary'}
        // size=
        data-active={isActive}
        aria-current={isActive ? 'true' : 'false'}
        to={to}
        className={cn(isActive ? 'bg-fg-accent' : 'bg-fg-accent/10', className)}
      />
    </>
  );
};
