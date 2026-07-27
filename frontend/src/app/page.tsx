import { categories } from '@/entities/category/mock/categories';
import { mapProductToCard } from '@/entities/product/api/product-mapper';
import { productStore } from '@/entities/product/mock/products';
import { type ProductCardDTO } from '@/entities/product/model/types';
import { wait } from '@/shared/lib/utils';
import { Heading } from '@/shared/ui/heading';
import {
  CreatingGankaSection,
  ExclusiveSection,
  GiftPackingSection,
  ProductTypeSection,
  RecommendedProductsSection,
  StayInTouchSection,
} from '@/widgets/sections/home';
import { Hero } from '@/widgets/sections/home/hero';

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
      <Hero />
      <Heading headingLevel="h1" visibility="hidden">
        Ganka for Home Magazine
      </Heading>
      <ProductTypeSection categories={categories} />
      <RecommendedProductsSection products={products} limit={limit} />
      <CreatingGankaSection />
      <ExclusiveSection />
      <StayInTouchSection />
      <GiftPackingSection />
      {/* <ProductSearch /> */}
      {/* <NewsLetter /> */}
      {/* <Collections />
      <Collections />
      <Products />
      <Features /> */}
    </>
  );
}
