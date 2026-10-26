import { Fragment } from 'react';

import { cn, repeat } from '@/shared/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { Container } from '@/shared/ui/container';
import { Skeleton } from '@/shared/ui/skeleton';

import { BREADCRUMBS_SPACING } from './breadcrumbs-spacing';

interface BreadcrumbsSkeletonProps {
  itemsCount?: number;
  /** Same layout override as `Breadcrumbs`. */
  className?: string;
}

export function BreadcrumbsSkeleton({
  itemsCount = 2,
  className,
}: BreadcrumbsSkeletonProps) {
  return (
    <Container className={cn(BREADCRUMBS_SPACING, className)}>
      <Breadcrumb spacing="top" aria-hidden="true">
        <BreadcrumbList>
          <BreadcrumbItem>
            <div className="flex items-center gap-2">
              <Skeleton className="size-4" />
              <Skeleton className="h-[1lh] w-16" />
            </div>
          </BreadcrumbItem>

          {repeat(itemsCount).map((_, index) => (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Skeleton
                  className={`h-[1lh] ${
                    index === itemsCount - 1 ? 'w-28' : 'w-20'
                  }`}
                />
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </Container>
  );
}
