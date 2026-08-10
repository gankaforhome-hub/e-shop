import { Suspense } from 'react';

import { type Metadata } from 'next';

import { setRequestLocale } from 'next-intl/server';

import { categories } from '@/entities/category/mock/categories';
import { mapProductToCard } from '@/entities/product/api/product-mapper';
import { productStore } from '@/entities/product/mock/products';
import { type ProductCardDTO } from '@/entities/product/model/types';
import { getMetadata, type IGetMetadataProps } from '@/shared/i18n/get-metada';
import { buildMetadata } from '@/shared/i18n/helpers/build-metadata';
import { wait } from '@/shared/lib/utils';
import { Heading } from '@/shared/ui/heading';
import {
  CreatingGankaSection,
  ExclusiveSection,
  GiftPackingSection,
  ProductTypeSection,
  RecommendedProductsSection,
  StayInTouchSection,
} from '@/widgets/sections/home';
import { BannerSliderSkeleton, Hero } from '@/widgets/sections/home/hero';
import { bannerSlides } from '@/widgets/sections/home/hero/config/banner-data';

export async function generateMetadata({
  params,
}: IGetMetadataProps): Promise<Metadata> {
  const { lang } = await params;
  setRequestLocale(lang);

  // Завантажуємо dictionaries/{lang}/metadata/home.json
  const meta = await getMetadata('home', lang);

  return buildMetadata({
    meta,
    lang,
    path: '/',
  });
}

interface GetProductsParams {
  limit?: number;
  delay?: number;
}

const getProducts = async ({
  limit,
  delay = 1500,
}: GetProductsParams = {}): Promise<ProductCardDTO[]> => {
  await wait(delay);

  let data = [...productStore];

  if (limit) {
    data = data.slice(0, limit);
  }

  return data.map(mapProductToCard);
};

export default async function Page() {
  // const [dict, products] = await Promise.all([
  //   getDictionary(['common'], locale),
  //   getFeaturedProducts(),
  // ]);
  const limit = 8;

  const products = await getProducts({ limit, delay: 100 });

  return (
    <>
      <Suspense fallback={<BannerSliderSkeleton />}>
        <Hero bannerSlides={bannerSlides} />
      </Suspense>
      <Heading headingLevel="h1" visibility="hidden">
        Ganka for Home Magazine
      </Heading>
      <ProductTypeSection categories={categories} />
      <RecommendedProductsSection products={products} limit={limit} />
      <CreatingGankaSection />
      <ExclusiveSection />
      <StayInTouchSection />
      <GiftPackingSection />
      {/* <ProductSearch /> */}
      {/* <NewsLetter /> */}
      {/* <Collections />
      <Features /> */}
    </>
  );
}
