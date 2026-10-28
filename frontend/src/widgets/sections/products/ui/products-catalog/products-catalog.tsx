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
import {
  type CategoryFilterGroups,
  CatalogToolbar,
} from '@/features/catalog-filters';
import { getFilterGroups } from '@/features/catalog-filters/server';
import { CatalogFeed } from '@/features/catalog-pagination';
import { routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import { AppLink } from '@/shared/ui/app-link';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

import { ProductGrid } from '../product-grid/product-grid';
import { ProductGridSkeleton } from '../product-grid/product-grid-skeleton';

/**
 * Scroll/focus anchor right above the catalog toolbar: filter changes and
 * "Back to top" return here, so Filter, count and Sort stay visible under
 * the fixed header (`scroll-padding-top` on `<html>`). Page links scroll to
 * the page top instead (`CatalogFeed`).
 */
export const CATALOG_TOP_ID = 'catalog-top';

const CATALOG_HEADING_ID = 'catalog-heading';

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
 * Breadcrumb header "Home / Catalog / Category" + hidden h1, toolbar
 * (filter panel with categories, sort), paginated grid (`?page=`, 12 per
 * page) with "Load more", driven by the URL query and the favorites cookie.
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

  // The filter panel switches categories in its draft: it counts against
  // every category and needs each category's groups up front (all cached)
  const scopeParams = { lang, search, ...(ids && { ids }) };
  const [{ data, meta }, index, { common }, ...scopeFacets] = await Promise.all(
    [
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
      getCatalogIndex(scopeParams),
      getDictionary(['common'], lang),
      getCatalogFacets(scopeParams),
      ...categories.map(item =>
        getCatalogFacets({ ...scopeParams, category: item.slug }),
      ),
    ],
  );
  const [allGroups, ...categoryGroups] = await Promise.all(
    scopeFacets.map(facets => getFilterGroups(facets, lang)),
  );
  const groups: CategoryFilterGroups = {
    all: allGroups ?? [],
    byCategory: Object.fromEntries(
      categories.map((item, i) => [item.slug, categoryGroups[i] ?? []]),
    ),
  };

  const activeCategory = categories.find(item => item.slug === category);

  return (
    <>
      {/* "Home / Catalog / Category": "Catalog" clears the category (search
          and sort kept); without a category the trail ends at "Catalog" */}
      <Breadcrumbs
        items={
          activeCategory
            ? [
                {
                  label: common.navigation.main.allProducts,
                  href: routes.products({ search, sort }),
                },
              ]
            : []
        }
        lastItemTitle={
          activeCategory?.title ?? common.navigation.main.allProducts
        }
      />
      <Container>
        {/* The page's only h1 (request-dependent, so inside Suspense); the
          breadcrumb line is the visible header */}
        <Heading id={CATALOG_HEADING_ID} headingLevel="h1" visibility="hidden">
          {activeCategory?.title ?? common.navigation.main.allProducts}
        </Heading>
        {/* Lands exactly at `scroll-padding-top` (= expanded header height,
          which is the header's state after any upward scroll): flush, no gap */}
        <div id={CATALOG_TOP_ID} tabIndex={-1} className="outline-none" />
        {/* While the toolbar's navigation is pending (it carries
          `data-catalog-pending`), the results dim and pulse softly: CSS
          only, no shared client state between toolbar and server grid */}
        <div className="group/catalog">
          <CatalogToolbar
            scrollAnchorId={CATALOG_TOP_ID}
            groups={groups}
            total={meta.total}
            index={index}
            categories={categories.map(({ slug, title }) => ({ slug, title }))}
          />
          <div className="duration-(--dur-normal) group-has-data-catalog-pending/catalog:pointer-events-none group-has-data-catalog-pending/catalog:opacity-60 motion-safe:group-has-data-catalog-pending/catalog:animate-pulse transition-opacity">
            {data.length > 0 ? (
              <CatalogFeed
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
          </div>
        </div>
      </Container>
    </>
  );
}
