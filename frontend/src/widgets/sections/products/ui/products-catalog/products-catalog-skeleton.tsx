import { CATALOG_PAGE_SIZE } from '@/entities/product/catalog';
import { CatalogToolbarSkeleton } from '@/features/catalog-filters';
import { BreadcrumbsSkeleton } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';

import { ProductGridSkeleton } from '../product-grid/product-grid-skeleton';

export function ProductsCatalogSkeleton() {
  return (
    <>
      <BreadcrumbsSkeleton itemsCount={1} />
      <Container>
        <CatalogToolbarSkeleton />
        <ProductGridSkeleton count={CATALOG_PAGE_SIZE} />
      </Container>
    </>
  );
}
