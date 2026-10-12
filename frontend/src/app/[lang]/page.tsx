import { Suspense } from 'react';

import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { getMetadata, type IGetMetadataProps } from '@/shared/i18n/get-metada';
import { isValidLocale } from '@/shared/i18n/helpers';
import { buildMetadata } from '@/shared/i18n/helpers/build-metadata';
import { Heading } from '@/shared/ui/heading';
import {
  CreatingGankaSection,
  ExclusiveSection,
  GiftPackingSection,
  ProductTypeSection,
  ProductTypeSectionSkeleton,
  RecommendedProductsSection,
  RecommendedProductsSectionSkeleton,
  StayInTouchSection,
} from '@/widgets/sections/home';
import { BannerSliderSkeleton, Hero } from '@/widgets/sections/home/hero';

export async function generateMetadata({
  params,
}: IGetMetadataProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const meta = await getMetadata('home', lang);

  return buildMetadata({
    meta,
    lang,
    path: '/',
  });
}

interface IHomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: IHomePageProps) {
  const limit = 8;
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { home } = await getDictionary(['home'], lang);

  return (
    <>
      <Suspense fallback={<BannerSliderSkeleton />}>
        <Hero
          bannerSlides={home.hero.banners}
          ctaLabel={home.hero.viewCollection}
        />
      </Suspense>
      <Heading headingLevel="h1" visibility="hidden">
        {home.pageTitle}
      </Heading>
      <Suspense fallback={<ProductTypeSectionSkeleton count={6} />}>
        <ProductTypeSection lang={lang} {...home.sections.productTypes} />
      </Suspense>
      <Suspense fallback={<RecommendedProductsSectionSkeleton limit={limit} />}>
        <RecommendedProductsSection
          lang={lang}
          limit={limit}
          {...home.sections.recommendedProducts}
        />
      </Suspense>
      <CreatingGankaSection {...home.sections.creatingGanka} />
      <ExclusiveSection {...home.sections.exclusiveFromGanka} />
      <StayInTouchSection {...home.sections.stayInTouch} />
      <GiftPackingSection {...home.sections.giftPackaging} />
    </>
  );
}
