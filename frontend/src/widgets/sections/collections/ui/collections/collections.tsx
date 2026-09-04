import { CollectionCard, getCollections } from '@/entities/collection';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

interface ICollectionsSectionProps {
  lang: Locale;
}

export async function CollectionsSection({ lang }: ICollectionsSectionProps) {
  const [{ collections: collectionsDict }, collections] = await Promise.all([
    getDictionary(['collections'], lang),
    getCollections(lang),
  ]);

  return (
    <Section>
      <Container>
        <Heading headingLevel="h1" variant="pageHeader" visibility="hidden">
          {collectionsDict.collectionsHero.pageTitle}
        </Heading>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-8 xl:grid-cols-3 xl:gap-y-12">
          {collections.map(collection => (
            <li key={collection.id}>
              <CollectionCard collection={collection} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
