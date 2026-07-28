import { type FC } from 'react';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { type IAppMedia } from '@/shared/ui/app-media/app-media';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { useCarousel } from '@/shared/ui/carousel/core/useCarousel';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

interface IBannerSlideProps extends IAppMedia {
  type: 'image' | 'video';
  subTitle: string;
  title: string;
  slug: string;
}

export const BannerSlide: FC<IBannerSlideProps> = ({
  alt,
  title,
  subTitle,
  slug,
  ...props
}) => {
  const { isInitialize } = useCarousel();

  return (
    <>
      <div className="relative h-full w-full overflow-hidden">
        <AppMedia
          fill
          {...props}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="pointer-events-none h-full w-full select-none object-cover object-center"
          // overlay
        />
        <Box
          className={cn(
            'custom-transition absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center justify-end uppercase transition-opacity',
            isInitialize ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Text className="text-white">{subTitle}</Text>
          <Heading
            headingLevel="h2"
            className="text-center text-5xl font-bold tracking-widest text-white"
          >
            {title}
          </Heading>
          <Button asChild variant="default" className="mt-4 capitalize">
            <AppLink href={routes.collection(slug)}>View Collection</AppLink>
          </Button>
        </Box>
      </div>
    </>
  );
};
