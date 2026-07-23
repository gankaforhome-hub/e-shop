import { mapProductToCard } from '@/entities/product/api/product-mapper';
import { productStore } from '@/entities/product/mock/products';
import { type ProductCardDTO } from '@/entities/product/model/types';
import { wait } from '@/shared/lib/utils';
import { ExclusiveSection } from '@/widgets/sections/home/exclusive';
import { GiftPackingSection } from '@/widgets/sections/home/gift-packing';
import { ProductsSection } from '@/widgets/sections/products/products';

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
  const limit = 4;
  const products = await getProducts({ limit, delay: 1500 });

  return (
    <>
      {/* <Hero />
      <ProductTypes /> */}
      <ProductsSection products={products} limit={limit} />
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
