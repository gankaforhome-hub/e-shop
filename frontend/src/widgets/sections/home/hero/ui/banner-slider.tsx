'use client';

import { FC } from 'react';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';
import { MediaSlide } from '@/widgets/media-slide';

import { bannerSlides } from '../config/banner-data';

import { BannerPagination } from './banner-pagination';

interface IBannerSliderProps {
  className?: string;
}

export const BannerSlider: FC<IBannerSliderProps> = ({ className }) => {
  return (
    <Carousel
      className={cn('absolute inset-0 left-0 top-0 h-full w-full', className)}
      isAutoplay
      isFade
      opts={{
        align: 'start',
        loop: true,
        containScroll: false,
        duration: 100,
      }}
    >
      <CarouselContent className="h-100vw z-20 w-full">
        {bannerSlides.map(
          ({
            media: { src, alt, poster, type },
            id,
            slug,
            title,
            subTitle,
          }) => (
            <CarouselItem key={id}>
              <MediaSlide
                width={1620}
                height={850}
                sizes="(max-width: 768px) 100vw,(max-width: 1600px) 100vw, 1200px"
                type={type}
                src={src}
                alt={alt ?? ''}
                poster={poster ?? ''}
                className="h-[calc(90vh-var(--h-mob-header))] sm:h-[calc(80vh-var(--h-mob-header))]"
                priority
                overlay
              />
              <Box
                className={cn(
                  'absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center justify-end uppercase',
                )}
              >
                <Text variant="secondary">{subTitle}</Text>
                <Heading
                  headingLevel="h2"
                  tone="secondary"
                  className="text-center text-5xl font-bold tracking-widest"
                >
                  {title}
                </Heading>
                <Button
                  asChild
                  variant="default"
                  size="default"
                  border="withOutBorder"
                  className="mt-4 capitalize"
                >
                  <AppLink href={routes.collection(slug)}>
                    View Collection
                  </AppLink>
                </Button>
              </Box>
            </CarouselItem>
          ),
        )}
      </CarouselContent>

      <Box className="-translate-1/2 absolute bottom-12 left-1/2 z-50 flex items-center justify-center gap-2">
        {bannerSlides.map((_, idx) => (
          <BannerPagination key={idx} to={idx} />
        ))}
      </Box>
    </Carousel>
  );
};
