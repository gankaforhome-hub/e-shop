import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { Skeleton } from '@/shared/ui/skeleton';

import { ProductTypeListSkeleton } from '../../category';

interface IProductTypeSectionSkeletonProps {
  count?: number;
}

export function ProductTypeSectionSkeleton({
  count = 6,
}: IProductTypeSectionSkeletonProps) {
  return (
    <Section className="md:pt-15 pt-10 xl:pt-12">
      <Container className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex shrink-0 items-center justify-center lg:basis-1/3">
          <Skeleton className="h-8 w-48 rounded-md lg:h-9 lg:w-56" />
        </div>
        <div className="w-full min-w-0 flex-1">
          <ProductTypeListSkeleton count={count} />
        </div>
      </Container>
    </Section>
  );
}
