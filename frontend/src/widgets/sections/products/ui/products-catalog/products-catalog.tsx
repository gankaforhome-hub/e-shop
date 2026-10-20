import { type CategoryDTO } from '@/entities/category';
import {
  getCatalogFacets,
  getCatalogIndex,
  getProducts,
} from '@/entities/product';
import {
  CATALOG_PAGE_SIZE,
  parseCatalogQuery,
  serializeCatalogPage,
  serializeCatalogQuery,
} from '@/entities/product/catalog';
import {
  getFavoriteIds,
  withFavorites,
} from '@/features/add-to-favorite/server';
import { CatalogToolbar } from '@/features/catalog-filters';
import { getFilterGroups } from '@/features/catalog-filters/server';
import { CatalogFeed } from '@/features/catalog-pagination';
import { routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

import { ProductGrid } from '../product-grid/product-grid';
import { ProductGridSkeleton } from '../product-grid/product-grid-skeleton';

/**
 * Scroll/focus anchor right above the catalog toolbar: page links, filter
 * changes and "Back to top" return here, so Filter, categories and Sort stay
 * visible under the fixed header (`scroll-padding-top` on `<html>`).
 */
export const CATALOG_TOP_ID = 'catalog-top';

/** Raw request query; validated by `parseCatalogQuery`. */
export type ProductsSearchParams = Record<
  string,
  string | string[] | undefined
>;

interface ProductsCatalogProps {
  lang: Locale;
  categories: CategoryDTO[];
  /** Request-time query; awaited inside the Suspense boundary. */
  searchParams: Promise<ProductsSearchParams>;
}

/**
 * Toolbar (filter, categories, sort), paginated grid (`?page=`, 12 per page)
 * with "Load more", driven by the URL query and the favorites cookie.
 */
export async function ProductsCatalog({
  lang,
  categories,
  searchParams,
}: ProductsCatalogProps) {
  const query = parseCatalogQuery(await searchParams);
  const { category, search, sort, filters } = query;
  const limit = CATALOG_PAGE_SIZE;

  const favoriteIds = await getFavoriteIds();
  const ids = query.favoritesOnly ? [...favoriteIds] : undefined;

  const baseParams = { lang, category, search, ...(ids && { ids }) };
  const [{ data, meta }, facets, index, { common }] = await Promise.all([
    getProducts({
      lang,
      limit,
      page: query.page,
      search,
      category,
      filters,
      sort,
      ...(ids && { ids }),
    }),
    getCatalogFacets(baseParams),
    getCatalogIndex(baseParams),
    getDictionary(['common'], lang),
  ]);
  const groups = await getFilterGroups(facets, lang);

  const categoryChips = (align: 'center' | 'start') => (
    <div></div>
    // <CategoryFilter
    //   categories={categories}
    //   labels={{
    //     nav: common.catalog.filters.category,
    //     all: common.catalog.filters.allCategories,
    //   }}
    //   activeCategory={category}
    //   search={search}
    //   sort={sort}
    //   align={align}
    //   size={align === 'start' ? 'small' : 'title'}
    // />
  );

  return (
    <>
      {/* Lands exactly at `scroll-padding-top` (= expanded header height,
          which is the header's state after any upward scroll): flush, no gap */}
      <div id={CATALOG_TOP_ID} tabIndex={-1} className="outline-none" />
      <CatalogToolbar
        scrollAnchorId={CATALOG_TOP_ID}
        groups={groups}
        total={meta.total}
        index={index}
        categories={{
          bar: categoryChips('center'),
          panel: categoryChips('start'),
        }}
      />
      {data.length > 0 ? (
        <CatalogFeed
          scrollAnchorId={CATALOG_TOP_ID}
          page={meta.page}
          total={meta.total}
          pageSize={meta.limit}
          pageHrefs={Array.from({ length: meta.totalPages }, (_, index) =>
            routes.products(serializeCatalogPage(query, index + 1)),
          )}
          queryKey={routes.products(serializeCatalogQuery(query))}
          skeleton={
            // Size of the next batch; 0 on the last page (no "Load more")
            <ProductGridSkeleton
              count={Math.max(
                0,
                Math.min(meta.limit, meta.total - meta.page * meta.limit),
              )}
            />
          }
        >
          <ProductGrid
            products={withFavorites(data, favoriteIds)}
            limit={limit}
            lang={lang}
          />
        </CatalogFeed>
      ) : (
        <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
          <Text variant="muted" size="document">
            {common.catalog.filters.empty}
          </Text>
          <Button asChild variant="outline" size="small">
            <AppLink href={routes.products({ category, search, sort })}>
              {common.catalog.filters.clearAll}
            </AppLink>
          </Button>
        </div>
      )}
    </>
  );
}
