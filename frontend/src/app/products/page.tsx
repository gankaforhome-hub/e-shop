import { mapProductToCard } from '@/entities/product/api/product-mapper';
import { productStore } from '@/entities/product/mock/products';
import { type ProductCardDTO } from '@/entities/product/model/types';
import { cn, wait } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { ProductGrid } from '@/widgets/sections/products';
import { CategoryFilter } from '@/widgets/sections/products/ui/filter/category-filter';

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

export default async function ProductsPage() {
  const limit = 24;

  const products = await getProducts({ limit, delay: 1500 });
  return (
    <Section className={cn('mt-4')}>
      <Container>
        <Heading headingLevel="h1" visibility="hidden">
          Ganka for home products
        </Heading>
        <CategoryFilter />
        {/* <div className="mb-6 flex flex-wrap justify-center gap-4">
          {categories.map(category => (
            <span
              key={category.id}
              className="bg-surface-muted/50 rounded-full px-4 py-1 text-base"
            >
              {category.title}
            </span>
          ))}
        </div> */}
        <ProductGrid products={products} limit={limit} />
      </Container>
    </Section>
  );
}
