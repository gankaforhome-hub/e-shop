import { FC } from 'react';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { useCarousel } from '@/shared/ui/carousel/useCarousel';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';
import { MediaSlide } from '@/widgets/media-slide';

interface IBannerSlideProps {
  width: number;
  height: number;
  type: 'image' | 'video';
  src: string;
  alt: string;
  poster: string;
  subTitle: string;
  title: string;
  slug: string;
}

export const BannerSlide: FC<IBannerSlideProps> = ({
  width,
  height,
  type,
  src,
  alt,
  poster,
  title,
  subTitle,
  slug,
}) => {
  const { isInitialize } = useCarousel();
  return (
    <>
      <MediaSlide
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw,(max-width: 1600px) 100vw, 1200px"
        type={type}
        src={src}
        alt={alt ?? ''}
        poster={poster ?? ''}
        className="h-[calc(90vh-var(--h-mob-header))] md:h-[calc(80vh-var(--h-mob-header))]"
        priority
        overlay
      />
      <Box
        className={cn(
          'custom-transition absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center justify-end uppercase transition-opacity',
          isInitialize ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Text variant="secondary">{subTitle}</Text>
        <Heading
          headingLevel="h2"
          className="text-center text-5xl font-bold tracking-widest"
        >
          {title}
        </Heading>
        <Button asChild variant="default" className="mt-4 capitalize">
          <AppLink href={routes.collection(slug)}>View Collection</AppLink>
        </Button>
      </Box>
    </>
  );
};
