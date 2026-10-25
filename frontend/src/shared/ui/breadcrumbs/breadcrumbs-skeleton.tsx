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

interface BreadcrumbsSkeletonProps {
  itemsCount?: number;
}

export function BreadcrumbsSkeleton({
  itemsCount = 2,
}: BreadcrumbsSkeletonProps) {
  return (
    <Container>
      <Breadcrumb aria-hidden="true">
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
