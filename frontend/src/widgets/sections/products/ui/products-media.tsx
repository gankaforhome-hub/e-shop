import { FC } from 'react';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { Media } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
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
  media: Media[];
  slug: string;
  className?: string;
}

export const ProductsMedia: FC<IProductsMediaProps> = ({
  media,
  slug,
  className,
}) => {
  return (
    <Carousel
      className={cn('relative', className)}
      isOpacityTween
      opts={{ loop: true }}
    >
      <CarouselContent className="h-full w-full">
        {media.map(({ id, src, alt, poster, type }) => (
          <CarouselItem key={id}>
            <AppLink
              href={routes.product(slug)}
              className="custom-transition inline-flex h-full w-full transition-transform hover:scale-110"
            >
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
            </AppLink>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious
        variant="icon"
        className="-left-3 z-50 w-4 -translate-x-1/2 p-1"
      >
        <Icon name="arrow" />
      </CarouselPrevious>
      <CarouselNext
        variant="icon"
        className="-right-3 z-50 w-4 translate-x-1/2 p-1"
      >
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
