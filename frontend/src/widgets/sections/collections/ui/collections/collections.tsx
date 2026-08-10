import { CollectionCard, getCollections } from '@/entities/collection';
import { type Collection } from '@/entities/collection/model/types';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

export async function CollectionsSection() {
  const collections = await getCollections();

  return (
    <Section className="fpt-4/6 fpb-10/30">
      <Container>
        <ul className="sm:fgapr-8/12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection: Collection) => (
            <li key={collection.id}>
              <CollectionCard collection={collection} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
