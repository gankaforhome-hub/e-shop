import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia, type AppMediaProps } from '@/shared/ui/app-media';
import { Button } from '@/shared/ui/button';
import { useCarousel } from '@/shared/ui/carousel';
import { Heading } from '@/shared/ui/heading';
import { Overlay } from '@/shared/ui/overlay';
import { Text } from '@/shared/ui/text';

interface BannerSlideProps extends AppMediaProps {
  bannerSlide: {
    title: string;
    subTitle: string;
    slug: string;
    blurDataURL?: string;
  };
  index: number;
  ctaLabel: string;
}

export function BannerSlide({
  bannerSlide: { title, subTitle, slug, blurDataURL },
  index,
  ctaLabel,
  ...props
}: BannerSlideProps) {
  const { isInitialize, current } = useCarousel();
  const isSelected = current === index;
  const isContentVisible = isInitialize ? isSelected : index === 0;
  return (
    <div className="relative h-full w-full overflow-hidden">
      <AppMedia
        fill
        sizes="100vw"
        className="pointer-events-none h-full w-full select-none object-cover object-center"
        blurDataURL={blurDataURL}
        {...props}
      />
      <Overlay aria-hidden="true" />

      <div
        className={cn(
          'absolute inset-x-0 bottom-20 z-20 mx-auto flex max-w-xl flex-col items-center justify-end px-4 text-center uppercase',
          isContentVisible
            ? 'pointer-events-auto visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible translate-y-2 opacity-0',
          isInitialize &&
            'transition-[opacity,translate,visibility] motion-reduce:transition-none',
          isInitialize &&
            (isSelected
              ? 'duration-(--dur-slower) ease-subtle delay-200'
              : 'duration-(--dur-slow) ease-out'),
        )}
      >
        {subTitle && (
          <Text className="text-sm tracking-widest text-white/90">
            {subTitle}
          </Text>
        )}

        <Heading
          headingLevel="h2"
          font="display"
          className="mt-2 text-4xl font-bold tracking-widest text-white drop-shadow-md sm:text-5xl"
        >
          {title}
        </Heading>

        <Button asChild variant="default" className="mt-6 capitalize shadow-lg">
          <AppLink href={routes.collection(slug)}>{ctaLabel}</AppLink>
        </Button>
      </div>
    </div>
  );
}
