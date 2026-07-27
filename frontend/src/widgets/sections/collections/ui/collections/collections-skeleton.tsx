import { CollectionCardSkeleton } from '@/entities/collection';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

export const CollectionsSectionSkeleton = () => (
  <Section className="fpt-4/6 fpb-10/30">
    <Container>
      <ul className="sm:fgapr-8/12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <CollectionCardSkeleton />
          </li>
        ))}
      </ul>
    </Container>
  </Section>
);
