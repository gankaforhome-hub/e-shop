import {
  type ICollectionOverviewItem,
  CollectionOverviewSection,
} from '@/widgets/sections/common/collection-overview';

interface IOurExclusiveSectionProps {
  title: string;
  data: ICollectionOverviewItem[];
}

export async function OurExclusiveSection({
  title,
  data,
}: IOurExclusiveSectionProps) {
  return (
    <CollectionOverviewSection
      title={title}
      releases={data}
      sectionId="exclusive-works-from-ganka"
    />
  );
}
