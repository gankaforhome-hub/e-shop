import { getProducts, ProductCard } from '@/entities/product';
import { FavoriteButton } from '@/features/add-to-favorite';
import {
  getFavoriteIds,
  withFavorites,
} from '@/features/add-to-favorite/server';
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
  const [{ data }, favoriteIds] = await Promise.all([
    getProducts({ lang, limit }),
    getFavoriteIds(),
  ]);
  const products = withFavorites(data, favoriteIds);

  return (
    <Section aria-labelledby="recommended-product">
      <Container>
        <Heading
          id="recommended-product"
          headingLevel="h2"
          variant="section"
          position="center"
          visibility="hidden"
          className="mx-auto mb-8 md:mb-6 xl:mb-16"
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
          {products.map(product => (
            <li
              key={product.variant.id}
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
                lang={lang}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 67vw, 100vw"
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
