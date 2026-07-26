import { Suspense } from 'react';

import { ProductCard } from '@/entities/product';
import { type ProductCardDTO } from '@/entities/product/model/types';
import { FavoriteButton } from '@/features/add-to-favorite';
import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ScrollableContainer } from '@/shared/ui/scrollable-container';
import { Section } from '@/shared/ui/section';

import { RecommendedProductsSkeleton } from './ui';

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
      <Container>
        <Heading
          headingLevel="h2"
          variant="section"
          position="center"
          className="fmb-8/16"
        >
          Recommended Product
        </Heading>
        <Suspense fallback={<RecommendedProductsSkeleton count={4} />}>
          <ScrollableContainer
            as="ul"
            indicatorType="progress"
            gapClassName="gap-3 sm:gap-4 xl:gap-6"
            scrollClassName="lg:grid lg:grid-cols-4 lg:overflow-visible"
            indicatorClassName="lg:hidden mt-3 md:px-20"
          >
            {products.map(product => (
              <li
                key={product.id}
                className={cn(
                  'shrink-0 snap-start',
                  'w-full min-w-full',
                  'sm:w-[calc((100%-16px)/1.5)] sm:min-w-[calc((100%-16px)/1.5)]',
                  'md:w-[calc((100%-16px)/3)] md:min-w-[calc((100%-16px)/3)]',
                  'lg:w-auto lg:min-w-0 lg:shrink',
                )}
              >
                <ProductCard
                  className="w-full"
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
          </ScrollableContainer>
        </Suspense>
        <Button asChild variant="outline" className="fmt-8/16 mx-auto flex">
          <AppLink href={routes.products()}>View all catalog</AppLink>
        </Button>
      </Container>
    </Section>
  );
}
