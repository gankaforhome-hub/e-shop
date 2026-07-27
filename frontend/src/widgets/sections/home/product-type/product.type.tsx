import { Suspense } from 'react';

import { type Category } from '@/entities/category';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

import { ProductTypeList, ProductTypeListSkeleton } from '../../category';

interface Props {
  categories: Category[];
}

export function ProductTypeSection({ categories }: Props) {
  return (
    <Section className="md:pt-15 pt-10 lg:pt-12">
      <Container className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
        <Heading
          headingLevel="h2"
          variant="section"
          className="shrink-0 text-center lg:basis-1/3 lg:whitespace-nowrap lg:text-3xl"
        >
          Type of Products:
        </Heading>
        <Suspense fallback={<ProductTypeListSkeleton count={6} />}>
          <ProductTypeList categories={categories} />
        </Suspense>
      </Container>
    </Section>
  );
}
