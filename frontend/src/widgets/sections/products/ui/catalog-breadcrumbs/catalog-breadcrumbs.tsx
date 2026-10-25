import { type ComponentProps } from 'react';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  breadcrumbVariants,
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

export function CatalogBreadcrumbs({
  labels,
  categoryTitle,
  catalogHref,
}: CatalogBreadcrumbsProps) {
  const current = categoryTitle ?? labels.catalog;

  return (
    <Breadcrumb aria-label={labels.nav} className="text-foreground">
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

export function CatalogBreadcrumbsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className={cn(breadcrumbVariants(), 'text-sm md:text-base')}
    >
      <Skeleton className="h-lh w-48 md:w-64" />
    </div>
  );
}
