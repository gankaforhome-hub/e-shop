import { ProductCard } from '@/entities/product';
import { getProducts } from '@/entities/product/api/get-products';
import { FavoriteButton } from '@/features/add-to-favorite';
import { routes } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ScrollableContainer } from '@/shared/ui/scrollable-container';
import { Section } from '@/shared/ui/section';

interface IRecommendedProductsSectionProps {
  title: string;
  btnViewAllCatalog: string;
  lang: Locale;
  limit?: number;
  className?: string;
  paginationPlacement?: 'top' | 'bottom' | 'none';
}
export async function RecommendedProductsSection({
  title,
  lang,
  limit = 8,
  btnViewAllCatalog,
}: IRecommendedProductsSectionProps) {
  const { data: products } = await getProducts({ lang, limit });

  return (
    <Section aria-labelledby="recommended-product">
      <Container>
        <Heading
          id="recommended-product"
          headingLevel="h2"
          variant="section"
          position="center"
        >
          {title}
        </Heading>
        <ScrollableContainer
          as="ul"
          indicatorType="progress"
          gapClassName="gap-3 sm:gap-4 xl:gap-6"
          scrollClassName="lg:grid lg:grid-cols-4 lg:overflow-visible"
          indicatorClassName="lg:hidden mt-3 md:px-20"
        >
          {products.map((product, index) => (
            <li
              key={product.id}
              className={cn(
                'shrink-0 snap-start',
                'w-full sm:w-[calc((100%-16px)/1.5)]',
                'md:w-[calc((100%-16px)/3)]',
                'lg:w-auto lg:shrink',
              )}
            >
              <ProductCard
                className="w-full"
                product={product}
                priority={index < 2}
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
        <Button
          asChild
          variant="outline"
          className="sm:max-w-75 mx-auto mt-8 flex w-full md:mt-4 xl:mt-16"
        >
          <AppLink href={routes.products()}>{btnViewAllCatalog}</AppLink>
        </Button>
      </Container>
    </Section>
  );
}

//{/* Mobile: Slider via CSS. Desktop: Grid*/}
// {/* <div className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-3 lg:grid-cols-4">
//   {products.map(product => (
//     <div
//       key={product.id}
//       className="w-full min-w-full shrink-0 snap-center sm:w-auto sm:min-w-0 sm:shrink"
//     >
//       <ProductCard
//         className="w-full"
//         product={product}
//         favoriteButton={
//           <FavoriteButton
//             productId={product.id}
//             initialFavorite={product.isFavorite}
//           />
//         }
//       />
//     </div>
//   ))}
// </div> */}
