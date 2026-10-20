import { type ComponentProps } from 'react';

import { routes } from '@/shared/config/routes';
import { AppLink } from '@/shared/ui/app-link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { Icon } from '@/shared/ui/icon';
import { Skeleton } from '@/shared/ui/skeleton';

interface CatalogBreadcrumbsProps {
  labels: {
    home: string;
    catalog: string;
    /** Accessible name of the trail. */
    nav: string;
  };
  /** Applied category title; the trail then ends with it. */
  categoryTitle?: string | undefined;
  /** "Catalog" link with the category cleared (search/sort kept). */
  catalogHref: ComponentProps<typeof AppLink>['href'];
}

/**
 * The catalog's only header: "Home / Catalog / Category", styled like the
 * shared `Breadcrumbs` (home icon, brand-coloured home link) but with
 * compact paddings; "Catalog" clears the category in one click. No count
 * here: the toolbar holds the page's single product count. Server-rendered
 * from the parsed query, so it lives inside the catalog's Suspense boundary.
 */
export function CatalogBreadcrumbs({
  labels,
  categoryTitle,
  catalogHref,
}: CatalogBreadcrumbsProps) {
  const current = categoryTitle ?? labels.catalog;

  return (
    <Breadcrumb
      aria-label={labels.nav}
      className="text-foreground pb-3 pt-2 md:pb-4 md:pt-4"
    >
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <AppLink
              href={routes.home}
              className="text-action-primary flex items-baseline"
            >
              <Icon
                name="home"
                iconPosition="left"
                className="text-foreground size-4"
              >
                {labels.home}
              </Icon>
            </AppLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {categoryTitle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <AppLink href={catalogHref}>{labels.catalog}</AppLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/** Same line height (breadcrumb list type, `1lh`) and paddings. */
export function CatalogBreadcrumbsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="pb-3 pt-2 text-sm md:pb-4 md:pt-4 md:text-base"
    >
      <Skeleton className="h-[1lh] w-48 md:w-64" />
    </div>
  );
}
