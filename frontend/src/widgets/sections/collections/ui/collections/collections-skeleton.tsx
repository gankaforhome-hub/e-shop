import { CollectionCardSkeleton } from '@/entities/collection';
import { repeat } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

export const CollectionsSectionSkeleton = () => (
  <>
    <Section>
      <Container>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-8 xl:grid-cols-3 xl:gap-y-12">
          {repeat(6).map((_, i) => (
            <li key={i}>
              <CollectionCardSkeleton />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  </>
);
