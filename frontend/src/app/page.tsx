// const Products = dynamic(
//   () => import('@/widgets/sections/products').then(mod => mod.Products),
//   {
//     ssr: true,
//     //TODO add carousel fallback Skeleton
//     loading: () => <p>Loading...</p>,
//   },
// );
// Dynamic loading of carousel - only on the customer

import { NewsLetter } from '@/widgets/news-letter';
import { Features } from '@/widgets/sections/features';
import { Collections } from '@/widgets/sections/home/collections';
import { Exclusive } from '@/widgets/sections/home/exclusive';
import { Hero } from '@/widgets/sections/home/hero';
import { ProductTypes } from '@/widgets/sections/product-types';
import { Products } from '@/widgets/sections/products';

export default function Page() {
  return (
    <>
      <Hero />
      <ProductTypes />
      <Products />
      <Collections />
      <Exclusive />
      <Collections />
      <Products />
      <NewsLetter />
      <Features />
    </>
  );
}
