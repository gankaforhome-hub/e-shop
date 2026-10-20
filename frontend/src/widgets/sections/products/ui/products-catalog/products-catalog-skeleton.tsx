import { CATALOG_PAGE_SIZE } from '@/entities/product/catalog';
import { CatalogToolbarSkeleton } from '@/features/catalog-filters';

import { CatalogBreadcrumbsSkeleton } from '../catalog-breadcrumbs/catalog-breadcrumbs';
import { ProductGridSkeleton } from '../product-grid/product-grid-skeleton';

/**
 * Fallback for `ProductsCatalog`: breadcrumb line, toolbar and one page of
 * card skeletons.
 */
export function ProductsCatalogSkeleton() {
  return (
    <>
      <CatalogBreadcrumbsSkeleton />
      <CatalogToolbarSkeleton />
      <ProductGridSkeleton count={CATALOG_PAGE_SIZE} />
    </>
  );
}
