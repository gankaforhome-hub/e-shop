import { getProducts } from '@/entities/product';
import {
  getFavoriteIds,
  withFavorites,
} from '@/features/add-to-favorite/server';
import { routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';
import { ProductGrid } from '@/widgets/sections/products';

/** Upper bound for one page of saved items (no pagination on the wishlist). */
const WISHLIST_LIMIT = 100;

interface WishlistGridProps {
  lang: Locale;
}

/**
 * The visitor's saved products as catalog cards (one per colour/glaze).
 * Reads the favorites cookie: render inside `<Suspense>`. Un-hearting a card
 * re-renders the route, so it leaves the grid.
 */
export async function WishlistGrid({ lang }: WishlistGridProps) {
  const [favoriteIds, { common }] = await Promise.all([
    getFavoriteIds(),
    getDictionary(['common'], lang),
  ]);

  const { data } =
    favoriteIds.size > 0
      ? await getProducts({
          lang,
          ids: [...favoriteIds],
          limit: WISHLIST_LIMIT,
        })
      : { data: [] };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <Text variant="muted">{common.favorites.empty}</Text>
        <Button asChild variant="outline">
          <AppLink href={routes.products()}>
            {common.favorites.emptyCta}
          </AppLink>
        </Button>
      </div>
    );
  }

  return (
    <ProductGrid
      products={withFavorites(data, favoriteIds)}
      lang={lang}
      limit={0}
    />
  );
}
