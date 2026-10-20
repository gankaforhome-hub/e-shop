import { Fragment } from 'react';

import { repeat } from '@/shared/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { Container } from '@/shared/ui/container';
import { Skeleton } from '@/shared/ui/skeleton';

import {
  breadcrumbsContainerVariants,
  type BreadcrumbsSpacing,
} from './breadcrumbs.styles';

interface BreadcrumbsSkeletonProps {
  itemsCount?: number;
  spacing?: BreadcrumbsSpacing;
}

export function BreadcrumbsSkeleton({
  itemsCount = 2,
  spacing,
}: BreadcrumbsSkeletonProps) {
  return (
    <Container className={breadcrumbsContainerVariants({ spacing })}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <div className="flex items-center gap-2">
              <Skeleton className="size-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          </BreadcrumbItem>

          {repeat(itemsCount).map((_, index) => (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Skeleton
                  className={`h-4 ${
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
