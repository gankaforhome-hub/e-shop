'use client';

import { cn } from '@/shared/lib/utils';
import { CarouselCurrent } from '@/shared/ui/carousel';
import { useCarousel } from '@/shared/ui/carousel/core/useCarousel';

interface IGalleryPaginationProps {
  className?: string;
  to: number;
  dotsType?: 'primary' | 'secondary';
  active?: boolean;
}

export function GalleryPagination({
  className,
  to,
  dotsType = 'primary',
  active,
}: IGalleryPaginationProps) {
  const { current } = useCarousel();
  const isActive = active ?? current === to;

  return (
    <>
      <CarouselCurrent
        animateScroll={false}
        variant={dotsType === 'primary' ? 'dot' : 'dotSecondary'}
        data-active={isActive}
        aria-current={isActive ? 'true' : 'false'}
        to={to}
        className={cn(className)}
      />
    </>
  );
}
