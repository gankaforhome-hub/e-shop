import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { getLocalizedProducts, getProductBySlug } from '@/entities/product';
import { routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { locales } from '@/shared/i18n/routing';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import {
  ProductDetailSection,
  ProductDetailSkeleton,
} from '@/widgets/sections/product';

interface ProductPageProps {
  params: Promise<{ productSlug: string; lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    locales.map(async lang =>
      (await getLocalizedProducts(lang)).map(product => ({
        lang,
        productSlug: product.slug,
      })),
    ),
  );
  return perLocale.flat();
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { productSlug, lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const [dict, product] = await Promise.all([
    getDictionary(['common'], lang),
    getProductBySlug(productSlug, lang),
  ]);
  if (!product) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: dict.common.navigation.main.collections,
            href: routes.collections,
          },
          {
            label: product.primaryCollection.title,
            href: routes.collection(product.primaryCollection.slug),
          },
        ]}
      />
      {/* The selected variant comes from `?variant=`, so only this part streams */}
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailSection
          product={product}
          lang={lang}
          searchParams={searchParams}
        />
      </Suspense>
    </>
  );
}
