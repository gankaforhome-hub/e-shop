import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/ui/section';

import { type TBannerSlide } from './model/types';
import { BannerSlider } from './ui/banner-slider';

interface IHero {
  bannerSlides: TBannerSlide[];
}

export async function Hero({ bannerSlides }: IHero) {
  // Info generate blurDataUrl
  // const slidesWithBlur = await Promise.all(
  //   bannerSlides.map(async slide => {
  //     if (!slide.media?.src || slide.media.src.endsWith('.mp4')) {
  //       return slide;
  //     }
  //     const blurDataURL = await getBlurPlaceholder(slide.media.src);
  //     console.log('🚀 ~ Hero ~ blurDataURL:', blurDataURL);
  //     return {
  //       ...slide,
  //       media: {
  //         ...slide.media,
  //         ...(blurDataURL ? { blurDataURL } : {}),
  //       },
  //     };
  //   }),
  // );
  return (
    <Section className="overflow-hidden pb-0">
      <BannerSlider
        bannerSlides={bannerSlides}
        className={cn(
          'md:aspect-21/9 relative aspect-video h-[calc(640px-var(--h-header-mobile))] w-full md:h-[calc(100dvh-var(--h-header-tab))] lg:h-[calc(100dvh-var(--h-header-desktop))] landscape:max-md:h-80',
          'touch-pan-y overscroll-none',
        )}
      />
    </Section>
  );
}

// 'h-[calc(640px-var(--h-topbar))]',
//"landscape:max-md:h-80",
// 'md:h-[calc(100dvh-var(--h-topbar))]',
