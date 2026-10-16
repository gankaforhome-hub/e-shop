import { type CategoryDTO } from '@/entities/category';
import { CATALOG_PAGE_SIZE } from '@/entities/product/catalog';
import { CatalogToolbarSkeleton } from '@/features/catalog-filters';

import { CategoryFilter } from '../category-filter/category-filter';
import { ProductGridSkeleton } from '../product-grid/product-grid-skeleton';

interface ProductsCatalogSkeletonProps {
  categories: CategoryDTO[];
  labels: { nav: string; all: string };
}

/**
 * Fallback for `ProductsCatalog`: same toolbar (with the real category chips,
 * which need no request data) and one page of card skeletons.
 */
export function ProductsCatalogSkeleton({
  categories,
  labels,
}: ProductsCatalogSkeletonProps) {
  return (
    <>
      <CatalogToolbarSkeleton
        categoryBar={<CategoryFilter categories={categories} labels={labels} />}
      />
      <ProductGridSkeleton count={CATALOG_PAGE_SIZE} />
    </>
  );
}
