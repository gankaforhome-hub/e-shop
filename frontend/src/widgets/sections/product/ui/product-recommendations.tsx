import { Suspense } from 'react';

import {
  getRecommendedProducts,
  type ProductCardDTO,
} from '@/entities/product';
import {
  getFavoriteIds,
  withFavorites,
} from '@/features/add-to-favorite/server';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { ProductGrid, ProductGridSkeleton } from '@/widgets/sections/products';

/** Cards in the block: two full rows of four from `lg`. */
const RECOMMENDATIONS_LIMIT = 8;

// Catalog grid tracks, but rows of four from `lg` (no orphans in 3 columns)
const GRID_CLASS = 'lg:grid-cols-4';

const HEADING_ID = 'product-recommendations';

interface ProductRecommendationsProps {
  productId: string;
  lang: Locale;
}

interface RecommendationGridProps {
  products: ProductCardDTO[];
  lang: Locale;
}

/** Merges the visitor's favorites (cookie) into cached cards. */
async function RecommendationGrid({ products, lang }: RecommendationGridProps) {
  const favoriteIds = await getFavoriteIds();

  return (
    <ProductGrid
      products={withFavorites(products, favoriteIds)}
      lang={lang}
      limit={0}
      priorityCount={0}
      className={GRID_CLASS}
    />
  );
}

/**
 * "You may also like" below the PDP, as catalog cards without filters: the
 * same collection first, then the same category, then the rest. Omitted when
 * there are no products. The list is cached and prerendered; only the
 * favorites state streams.
 */
export async function ProductRecommendations({
  productId,
  lang,
}: ProductRecommendationsProps) {
  const [products, { product: dict }] = await Promise.all([
    getRecommendedProducts({
      productId,
      lang,
      group: 'all',
      limit: RECOMMENDATIONS_LIMIT,
    }),
    getDictionary(['product'], lang),
  ]);

  if (products.length === 0) {
    return null;
  }

  return (
    <Section aria-labelledby={HEADING_ID}>
      <Container className="flex flex-col gap-6 md:gap-8">
        <Heading
          id={HEADING_ID}
          headingLevel="h2"
          variant="document"
          position="center"
          className="mx-auto"
        >
          {dict.youMayAlsoLike}
        </Heading>
        {/* Only the hearts are per-visitor: the skeleton has the exact card count */}
        <Suspense
          fallback={
            <ProductGridSkeleton
              count={products.length}
              className={GRID_CLASS}
            />
          }
        >
          <RecommendationGrid products={products} lang={lang} />
        </Suspense>
      </Container>
    </Section>
  );
}
