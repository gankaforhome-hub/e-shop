import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { getCategories } from '@/entities/category';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import {
  CategoryFilter,
  ProductGridSkeleton,
  ProductsCatalog,
  type ProductsSearchParams,
} from '@/widgets/sections/products';

const PRODUCTS_LIMIT = 24;

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
      <Section className="mt-4">
        <Container>
          <Heading headingLevel="h1" visibility="hidden">
            {common.navigation.main.allProducts}
          </Heading>
          <Suspense
            fallback={
              <>
                <CategoryFilter categories={categories} />
                <ProductGridSkeleton count={8} />
              </>
            }
          >
            <ProductsCatalog
              lang={lang}
              categories={categories}
              limit={PRODUCTS_LIMIT}
              searchParams={searchParams}
            />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
