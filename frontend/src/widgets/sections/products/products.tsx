import { Suspense } from 'react';

import { type ProductCardDTO } from '@/entities/product/model/types';
import { cn } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

import { ProductGrid, ProductGridSkeleton } from './ui';

interface IProductsSection {
  className?: string;
  limit: number;
  products: ProductCardDTO[];
}

export async function ProductsSection({
  products,
  limit = 4,
  className,
}: IProductsSection) {
  return (
    <>
      <Section className={cn('', className)}>
        <Container>
          <Heading headingLevel="h2" visibility="hidden">
            Ganka for home products
          </Heading>
          <Suspense fallback={<ProductGridSkeleton count={limit} />}>
            <ProductGrid products={products} limit={limit} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
