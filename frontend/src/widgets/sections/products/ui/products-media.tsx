import { FC } from 'react';

import { ProductMedia } from '@/entities/product-card';
import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';
import { Icon } from '@/shared/ui/icon';
import { MediaSlide } from '@/widgets/media-slide';

import { ProductPagination } from './product-pagination';

interface IProductsMediaProps {
  media: ProductMedia[];
  className?: string;
}

export const ProductsMedia: FC<IProductsMediaProps> = ({
  media,
  className,
}) => {
  return (
    <Carousel
      className={cn('relative h-full w-full', className)}
      isOpacityTween
      opts={{ loop: true }}
    >
      <CarouselContent className="h-100vw z-20 w-full">
        {media.map(({ id, src, alt, poster, type }) => (
          <CarouselItem key={id}>
            <MediaSlide
              width={270}
              height={270}
              sizes="(max-width: 768px) 210px, 270px"
              type={type}
              src={src}
              alt={alt ?? ''}
              poster={poster ?? ''}
              className="h-full w-full"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious variant="icon">
        <Icon name="arrow" />
      </CarouselPrevious>
      <CarouselNext variant="icon">
        <Icon name="arrow" />
      </CarouselNext>
      <Box className="-translate-1/2 absolute -bottom-6 left-1/2 z-50 flex w-full max-w-full items-center justify-center gap-2">
        {media.map((_, idx) => (
          <ProductPagination key={idx} to={idx} />
        ))}
      </Box>
    </Carousel>
  );
};
