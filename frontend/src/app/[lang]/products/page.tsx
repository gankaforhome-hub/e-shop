import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { getCategories } from '@/entities/category';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { BackToTop } from '@/shared/ui/back-to-top';
import { Section } from '@/shared/ui/section';
import {
  CATALOG_TOP_ID,
  ProductsCatalog,
  ProductsCatalogSkeleton,
  type ProductsSearchParams,
} from '@/widgets/sections/products';

interface ProductsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<ProductsSearchParams>;
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const [{ common }, categories] = await Promise.all([
    getDictionary(['common'], lang),
    getCategories(lang),
  ]);

  return (
    <>
      <Section spacing="standard" flush="top">
        {/* The breadcrumbs and h1 depend on `?category=`, so they render
            inside the catalog's Suspense boundary (which owns the Container) */}
        <Suspense fallback={<ProductsCatalogSkeleton />}>
          <ProductsCatalog
            lang={lang}
            categories={categories}
            searchParams={searchParams}
          />
        </Suspense>
      </Section>
      <BackToTop label={common.catalog.backToTop} targetId={CATALOG_TOP_ID} />
    </>
  );
}
