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

/** Cards per block: one full row of four from `lg`. */
const BLOCK_LIMIT = 4;

// Catalog grid tracks, but one row of four from `lg` (no orphan in 3 columns)
const GRID_CLASS = 'lg:grid-cols-4';

interface ProductRecommendationsProps {
  productId: string;
  lang: Locale;
}

interface RecommendationBlockProps {
  id: string;
  title: string;
  products: ProductCardDTO[];
  lang: Locale;
}

/** Merges the visitor's favorites (cookie) into cached cards. */
async function RecommendationGrid({
  products,
  lang,
}: Pick<RecommendationBlockProps, 'products' | 'lang'>) {
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

function RecommendationBlock({
  id,
  title,
  products,
  lang,
}: RecommendationBlockProps) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-6 md:gap-8">
      <Heading
        id={id}
        headingLevel="h2"
        variant="document"
        position="center"
        className="mx-auto"
      >
        {title}
      </Heading>
      {/* Only the hearts are per-visitor: the skeleton has the exact card count */}
      <Suspense
        fallback={
          <ProductGridSkeleton count={products.length} className={GRID_CLASS} />
        }
      >
        <RecommendationGrid products={products} lang={lang} />
      </Suspense>
    </section>
  );
}

/**
 * Recommendations below the PDP, as catalog cards without filters: "From the
 * same collection", then "You may also like" (same category, then the rest).
 * Each block (with its heading) is omitted when it has no products. Lists are
 * cached and prerendered; only the favorites state streams per block.
 */
export async function ProductRecommendations({
  productId,
  lang,
}: ProductRecommendationsProps) {
  const [sameCollection, related, { product: dict }] = await Promise.all([
    getRecommendedProducts({
      productId,
      lang,
      group: 'collection',
      limit: BLOCK_LIMIT,
    }),
    getRecommendedProducts({
      productId,
      lang,
      group: 'related',
      limit: BLOCK_LIMIT,
    }),
    getDictionary(['product'], lang),
  ]);

  const blocks = [
    {
      id: 'recommendations-collection',
      title: dict.fromCollection,
      products: sameCollection,
    },
    {
      id: 'recommendations-related',
      title: dict.youMayAlsoLike,
      products: related,
    },
  ].filter(block => block.products.length > 0);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container className="flex flex-col gap-12 md:gap-16">
        {blocks.map(block => (
          <RecommendationBlock key={block.id} {...block} lang={lang} />
        ))}
      </Container>
    </Section>
  );
}
