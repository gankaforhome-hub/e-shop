import { getProducts } from '@/entities/product/api/get-products';
import { cn } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { ProductGrid } from '@/widgets/sections/products';
import { CategoryFilter } from '@/widgets/sections/products/ui/filter/category-filter';

interface IProductsPage {
  searchParams: Promise<{
    search?: string;
    category?: string;
    favoritesOnly?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: IProductsPage) {
  const limit = 24;
  const filters = await searchParams;
  const products = await getProducts(filters);

  return (
    <Section className={cn('mt-4')}>
      <Container>
        <Heading headingLevel="h1" visibility="hidden">
          Ganka for home products
        </Heading>
        <CategoryFilter />
        <ProductGrid products={products} limit={limit} />
      </Container>
    </Section>
  );
}
