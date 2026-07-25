import { mapProductToCard } from '@/entities/product/api/product-mapper';
import { productStore } from '@/entities/product/mock/products';
import { type ProductCardDTO } from '@/entities/product/model/types';
import { wait } from '@/shared/lib/utils';
import {
  ExclusiveSection,
  GiftPackingSection,
  RecommendedProductsSection,
} from '@/widgets/sections/home';

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
  const limit = 8;

  const products = await getProducts({ limit, delay: 1500 });
  return (
    <>
      {/* 
      <Hero />
      <Section className="bg-surface-muted pb-4">
        <Container className="py-auto flex h-40 w-full items-center justify-center">
          <Heading headingLevel="h1" className="text-brand-primary text-center">
            Ganka for Home
          </Heading>
        </Container>
             
      </Section>
      <ProductTypes />
       */}
      <RecommendedProductsSection products={products} limit={limit} />
      {/* <ProductGrid products={products} limit={limit} /> */}
      {/* <Section>
        <Container>
          <Heading headingLevel="h2" visibility="hidden">
            Ganka for home products
          </Heading>
        </Container>
      </Section> */}

      <ExclusiveSection />
      <GiftPackingSection />
      {/* <Collections />
      <Collections />
      <Products />
      <NewsLetter />
      <Features /> */}
    </>
  );
}
