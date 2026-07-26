// 'use client';

import { Suspense } from 'react';

import { type GallerySectionContent } from '@/shared/content/about-us';
// import { useMatchMedia } from '@/shared/lib/hooks/useMatchMedia';
import { cn } from '@/shared/lib/utils';
import { AppMedia } from '@/shared/ui/app-media';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';
import { MobileSliderWrapperWithProgressBar } from '@/shared/ui/slider/mobile-slider';

import { ProductSliderSkeletonWithProgress } from '../../home/recommended-products/ui';

export function GankaGallerySection({
  heading,
  description,
  images,
}: GallerySectionContent) {
  // const { isMobile, isLG } = useMatchMedia();
  // const [mounted, setMounted] = useState(false);
  // //TODO: learn about hydration
  // useEffect(() => {
  //   setMounted(true);
  // }, []);
  // const showMobileVersion = mounted ? !isLG : false;

  return (
    <Section aria-labelledby="artist-gallery-heading">
      <Container>
        <SectionIntro
          headingId="artist-gallery-heading"
          heading={heading}
          description={description}
          textPosition="center"
        />

        <Suspense fallback={<ProductSliderSkeletonWithProgress count={4} />}>
          <ul className="fmt-4/16">
            <MobileSliderWrapperWithProgressBar
              className="sm:flex! lg:grid! sm:overflow-x-auto"
              classNameProgress="sm:block lg:!hidden sm:mt-2 sm:px-0"
            >
              {images.map((image, index) => (
                <li
                  key={image.src}
                  className={cn(
                    'sm:rounded-card relative aspect-square w-full min-w-full snap-center overflow-hidden sm:snap-start',
                    'sm:w-[65%] sm:min-w-[65%] lg:w-auto lg:min-w-0 lg:shrink',
                  )}
                >
                  <AppMedia
                    src={image.src}
                    alt={image.alt || `Slide ${index + 1}`}
                    fill
                    className="object-cover object-center"
                  />
                </li>
              ))}
            </MobileSliderWrapperWithProgressBar>
          </ul>
        </Suspense>
      </Container>
    </Section>
  );
}
