import { notFound } from 'next/navigation';

import { getCategories } from '@/entities/category';
import { getProducts } from '@/entities/product/api/get-products';
import { isValidLocale } from '@/shared/i18n/helpers';
import { cn } from '@/shared/lib/utils';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { ProductGrid } from '@/widgets/sections/products';
import { CategoryFilter } from '@/widgets/sections/products/ui/category-filter/category-filter';

interface IProductsPage {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    search?: string;
    category?: string;
    favoritesOnly?: string;
  }>;
}

export default async function ProductsPage({
  params,
  searchParams,
}: IProductsPage) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }
  const limit = 24;
  const filters = await searchParams;
  const categories = await getCategories(lang);
  const { data: products } = await getProducts({ lang, limit, ...filters });

  return (
    <>
      <Breadcrumbs />
      <Section className={cn('mt-4')}>
        <Container>
          <Heading headingLevel="h1" visibility="hidden">
            Ganka for home products
          </Heading>
          <CategoryFilter categories={categories} />
          <ProductGrid products={products} limit={limit} lang={lang} />
        </Container>
      </Section>
    </>
  );
}
