import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

import { ProductTypeListSkeleton } from '../../category';

interface IProductTypeSectionSkeletonProps {
  count?: number;
}

export function ProductTypeSectionSkeleton({
  count = 6,
}: IProductTypeSectionSkeletonProps) {
  return (
    <Section className="md:pt-15 pt-10 xl:pt-12">
      <Container
        // className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between"
        className="flex w-full min-w-0 justify-center"
      >
        {/* <div
        // className="flex shrink-0 items-center justify-center lg:basis-1/3"
        >
          <Skeleton className="h-8 w-48 rounded-md lg:h-9 lg:w-56" />
        </div> */}
        <div
          // className="w-full min-w-0 flex-1"
          className="flex min-w-0 justify-center"
        >
          <ProductTypeListSkeleton count={count} />
        </div>
      </Container>
    </Section>
  );
}
