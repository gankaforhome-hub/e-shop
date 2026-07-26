import { Suspense } from 'react';

import { ProductCard } from '@/entities/product';
import { type ProductCardDTO } from '@/entities/product/model/types';
import { FavoriteButton } from '@/features/add-to-favorite';
import { routes } from '@/shared/config/routes';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { MobileSliderWrapperWithProgressBar } from '@/shared/ui/slider/mobile-slider';

import { ProductSliderSkeletonWithProgress } from './ui';

interface IRecommendedProductsSection {
  products: ProductCardDTO[];
  limit?: number;
  className?: string;
  paginationPlacement?: 'top' | 'bottom' | 'none';
}
export function RecommendedProductsSection({
  products,
  limit = 8,
  // content,
  // description,
}: IRecommendedProductsSection) {
  // return (
  //   <Section aria-labelledby="recommended-product-section">
  //     <Container>
  //       <Heading
  //         headingLevel="h2"
  //         variant={'section'}
  //         position="center"
  //         className="fmb-8/16"
  //       >
  //         Recommended Product
  //       </Heading>
  //     </Container>
  //     {/* Мобільний: слайдер через CSS. Десктоп: сітка */}
  //     {/* <div className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-3 lg:grid-cols-4">
  //       {products.map(product => (
  //         <div
  //           key={product.id}
  //           className="w-full min-w-full shrink-0 snap-center sm:w-auto sm:min-w-0 sm:shrink"
  //         >
  //           <ProductCard
  //             className="w-full"
  //             product={product}
  //             favoriteButton={
  //               <FavoriteButton
  //                 productId={product.id}
  //                 initialFavorite={product.isFavorite}
  //               />
  //             }
  //           />
  //         </div>
  //       ))}
  //     </div> */}
  //     {/* <ResponsiveView
  //       mobileView={<MobileRecommendedProducts products={products} />}
  //       skeleton={<ProductCardSkeleton />}
  //       desktopView={
  //         <Container>
  //           <ProductGrid
  //             products={products}
  //             limit={limit}
  //             className="hidden sm:grid"
  //           />
  //         </Container>
  //       }
  //     /> */}
  //     <Suspense fallback={<ProductCardSkeleton />}>
  //       <MobileSliderWithProgress products={products} />
  //     </Suspense>
  //     <Container className="hidden sm:block">
  //       <ProductGrid products={products} limit={limit} />
  //     </Container>
  //     <Container>
  //       <Button asChild variant="outline" className="fmt-8/16 mx-auto flex">
  //         <AppLink href={routes.products}>View all catalog</AppLink>
  //       </Button>
  //     </Container>
  //   </Section>
  // );
  return (
    <Section aria-labelledby="recommended-product-section">
      <Container className="contents sm:block">
        <Heading
          headingLevel="h2"
          variant="section"
          position="center"
          className="fmb-8/16"
        >
          Recommended Product
        </Heading>
        <Suspense
          fallback={<ProductSliderSkeletonWithProgress count={limit} />}
        >
          <ul>
            <MobileSliderWrapperWithProgressBar totalItems={products.length}>
              {products.map(product => (
                <li
                  key={product.id}
                  className="w-full min-w-full shrink-0 snap-center sm:w-auto sm:min-w-0 sm:shrink"
                >
                  <ProductCard
                    className="w-full px-2"
                    product={product}
                    favoriteButton={
                      <FavoriteButton
                        productId={product.id}
                        initialFavorite={product.isFavorite}
                      />
                    }
                  />
                </li>
              ))}
            </MobileSliderWrapperWithProgressBar>
          </ul>
        </Suspense>
      </Container>

      <Container>
        <Button asChild variant="outline" className="fmt-8/16 mx-auto flex">
          <AppLink href={routes.products}>View all catalog</AppLink>
        </Button>
      </Container>
    </Section>
  );
}
