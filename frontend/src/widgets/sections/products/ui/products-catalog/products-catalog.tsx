import { type CategoryDTO } from '@/entities/category';
import { getProducts } from '@/entities/product';
import {
  getFavoriteIds,
  withFavorites,
} from '@/features/add-to-favorite/server';
import { type Locale } from '@/shared/i18n/routing';

import { CategoryFilter } from '../category-filter/category-filter';
import { ProductGrid } from '../product-grid/product-grid';

export type ProductsSearchParams = {
  search?: string | string[];
  category?: string | string[];
  favoritesOnly?: string | string[];
};

interface ProductsCatalogProps {
  lang: Locale;
  categories: CategoryDTO[];
  limit: number;
  /** Request-time query; awaited inside the Suspense boundary. */
  searchParams: Promise<ProductsSearchParams>;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** Filter bar + product grid driven by the URL query and the favorites cookie. */
export async function ProductsCatalog({
  lang,
  categories,
  limit,
  searchParams,
}: ProductsCatalogProps) {
  const query = await searchParams;
  const search = first(query.search);
  const category = first(query.category);
  const favoritesOnly = first(query.favoritesOnly) === 'true';

  const favoriteIds = await getFavoriteIds();
  const { data } = await getProducts({
    lang,
    limit,
    search,
    category,
    ...(favoritesOnly && { ids: [...favoriteIds] }),
  });

  return (
    <>
      <CategoryFilter
        categories={categories}
        activeCategory={category}
        search={search}
      />
      <ProductGrid
        products={withFavorites(data, favoriteIds)}
        limit={limit}
        lang={lang}
      />
    </>
  );
}
