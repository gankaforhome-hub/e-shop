import { type BannerLinkType, type HeroBannerDTO } from '@/entities/banner';
import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/ui/section';

import { HERO_HEIGHT } from './config/hero-layout';
import { type TBannerSlide } from './model/types';
import { BannerSlider } from './ui/banner-slider';

interface HeroFallbackTexts {
  title: string;
  subtitle: string;
  ctaLabel: string;
  alt: string;
}

interface HeroProps {
  banners: HeroBannerDTO[];
  /** Button text of a slide without its own, per link type. */
  ctaLabels: Record<BannerLinkType, string>;
  /** Static slide shown when there are no banners (none live, or the API is down). */
  fallback: HeroFallbackTexts;
}

const FALLBACK_IMAGE_SRC = '/images/hero_image.webp';

function getFallbackSlide({
  title,
  subtitle,
  ctaLabel,
  alt,
}: HeroFallbackTexts): TBannerSlide {
  return {
    id: 'fallback',
    title,
    subTitle: subtitle,
    href: routes.products(),
    ctaLabel,
    media: { src: FALLBACK_IMAGE_SRC, alt },
  };
}

export function Hero({ banners, ctaLabels, fallback }: HeroProps) {
  const bannerSlides = banners.map(
    ({
      id,
      title,
      subtitle,
      href,
      linkType,
      ctaLabel,
      media,
    }): TBannerSlide => ({
      id,
      title,
      subTitle: subtitle,
      href,
      ctaLabel: ctaLabel ?? ctaLabels[linkType],
      media,
    }),
  );

  return (
    <Section className="overflow-hidden" spacing="none">
      <BannerSlider
        bannerSlides={
          bannerSlides.length > 0 ? bannerSlides : [getFallbackSlide(fallback)]
        }
        className={cn(
          'relative w-full',
          HERO_HEIGHT,
          'touch-pan-y overscroll-none',
        )}
      />
    </Section>
  );
}
