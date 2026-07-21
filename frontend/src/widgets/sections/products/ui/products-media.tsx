import { type FC } from 'react';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { type Media } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { Box } from '@/shared/ui/box';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';
import { Icon } from '@/shared/ui/icon';

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
    <Carousel className={cn('', className)} opts={{ loop: true }}>
      <CarouselContent className="touch-pan-y">
        {media.map(({ id, src, alt, poster }) => (
          <CarouselItem key={id} className="h-full w-full">
            <AppLink href={routes.product(slug)}>
              <AppMedia
                width={270}
                height={270}
                sizes="(max-width: 768px) 210px, 270px"
                src={src}
                alt={alt ?? ''}
                poster={poster ?? ''}
                className="h-full w-full"
                loading="eager"
              />
            </AppLink>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious
        variant="icon"
        className={cn(
          'custom-transition -left-5 z-50 w-4 -translate-x-1/2 p-1 transition-opacity',
          'lg:-left-4 xl:opacity-0 xl:group-hover:opacity-100',
          'xl:w-5 xl:group-hover:-left-5',
        )}
      >
        <Icon name="arrow" className="fill-fg h-6 w-6" />
      </CarouselPrevious>
      <CarouselNext
        variant="icon"
        className={cn(
          'custom-transition -right-5 z-50 w-4 translate-x-1/2 p-1 transition-opacity',
          'lg:-right-4 xl:opacity-0 xl:group-hover:opacity-100',
          'xl:w-5 xl:group-hover:-right-5',
        )}
      >
        <Icon name="arrow" className="fill-fg h-6 w-6" />
      </CarouselNext>
      <Box
        className={cn(
          'absolute -bottom-10 z-50 flex w-full items-center justify-center gap-2 lg:bottom-0',
          'custom-transition transition-opacity lg:opacity-0 lg:group-hover:opacity-100',
        )}
      >
        {media.map((_, idx) => (
          <ProductPagination key={idx} to={idx} />
        ))}
      </Box>
    </Carousel>
  );
};
