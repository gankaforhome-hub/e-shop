import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { getCategories } from '@/entities/category';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { BackToTop } from '@/shared/ui/back-to-top';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
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
      <Breadcrumbs />
      <Section>
        <Container>
          <Heading headingLevel="h1" visibility="hidden">
            {common.navigation.main.allProducts}
          </Heading>
          <Suspense
            fallback={
              <ProductsCatalogSkeleton
                categories={categories}
                labels={{
                  nav: common.catalog.filters.category,
                  all: common.catalog.filters.allCategories,
                }}
              />
            }
          >
            <ProductsCatalog
              lang={lang}
              categories={categories}
              searchParams={searchParams}
            />
          </Suspense>
        </Container>
      </Section>
      <BackToTop label={common.catalog.backToTop} targetId={CATALOG_TOP_ID} />
    </>
  );
}
