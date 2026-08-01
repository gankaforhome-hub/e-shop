import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { type IAppMedia } from '@/shared/ui/app-media/app-media';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { useCarousel } from '@/shared/ui/carousel/core/useCarousel';
import { Heading } from '@/shared/ui/heading';
import { Overlay } from '@/shared/ui/overlay';
import { Text } from '@/shared/ui/text';

interface IBannerSlide extends IAppMedia {
  bannerSlide: {
    title: string;
    subTitle: string;
    slug: string;
    blurDataURL?: string;
  };
  index: number;
}

export function BannerSlide({
  bannerSlide: { title, subTitle, slug, blurDataURL },
  index,
  ...props
}: IBannerSlide) {
  const { isInitialize, current } = useCarousel();
  const isSelected = current === index;
  const isContentVisible = isInitialize && isSelected;
  return (
    <Box className="relative h-full w-full overflow-hidden">
      <AppMedia
        fill
        sizes="100vw"
        className="pointer-events-none h-full w-full select-none object-cover object-center"
        blurDataURL={blurDataURL}
        {...props}
      />
      <Overlay aria-hidden="true" />

      <Box
        className={cn(
          'absolute inset-x-0 bottom-20 z-20 mx-auto flex max-w-xl flex-col items-center justify-end px-4 text-center uppercase',
          isContentVisible
            ? 'duration-(--dur-slow) pointer-events-auto visible translate-y-0 opacity-100 transition-all delay-150 ease-out'
            : 'pointer-events-none invisible translate-y-4 opacity-0 transition-none',
        )}
      >
        {subTitle && (
          <Text className="text-sm tracking-widest text-white/90">
            {subTitle}
          </Text>
        )}

        <Heading
          headingLevel="h2"
          className="mt-2 text-4xl font-bold tracking-widest text-white drop-shadow-md sm:text-5xl"
        >
          {title}
        </Heading>

        <Button asChild variant="default" className="mt-6 capitalize shadow-lg">
          <AppLink href={routes.collection(slug)}>View Collection</AppLink>
        </Button>
      </Box>
    </Box>
  );
}
