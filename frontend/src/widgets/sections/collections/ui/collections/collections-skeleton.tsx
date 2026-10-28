import { CollectionCardSkeleton } from '@/entities/collection';
import { repeat } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

import { collectionsGridClassName } from './collections-grid-layout';

interface CollectionsGridSkeletonProps {
  count: number;
}

/** Placeholder grid of `count` cards (also the next "Load more" batch). */
export const CollectionsGridSkeleton = ({
  count,
}: CollectionsGridSkeletonProps) => (
  <ul className={collectionsGridClassName}>
    {repeat(count).map((_, i) => (
      <li key={i}>
        <CollectionCardSkeleton />
      </li>
    ))}
  </ul>
);

export const CollectionsSectionSkeleton = () => (
  <>
    <Section>
      <Container>
        <CollectionsGridSkeleton count={6} />
      </Container>
    </Section>
  </>
);
