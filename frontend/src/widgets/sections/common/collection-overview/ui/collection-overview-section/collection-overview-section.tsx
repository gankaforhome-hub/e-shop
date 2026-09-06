import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

import { type ICollectionOverviewItem } from '../../model';
import { CollectionOverviewList } from '../collection-overview-list/collection-overview-list';

interface ICollectionOverviewSectionProps {
  title: string;
  releases: ICollectionOverviewItem[];
  sectionId?: string;
}

export const CollectionOverviewSection = ({
  title,
  releases,
  sectionId = 'ganka-collections',
}: ICollectionOverviewSectionProps) => {
  return (
    <Section aria-labelledby={sectionId}>
      <Container>
        <Heading
          id={sectionId}
          headingLevel="h2"
          variant="section"
          visibility="hidden"
        >
          {title}
        </Heading>
        <CollectionOverviewList releases={releases} />
      </Container>
    </Section>
  );
};
