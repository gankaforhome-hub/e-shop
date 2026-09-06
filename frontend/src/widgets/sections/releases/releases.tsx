import {
  CollectionOverviewSection,
  type ICollectionOverviewItem,
} from '@/widgets/sections/common/collection-overview';

interface IReleasesSectionProps {
  title: string;
  data: ICollectionOverviewItem[];
}

export async function ReleasesSection({ title, data }: IReleasesSectionProps) {
  return (
    <CollectionOverviewSection
      title={title}
      releases={data}
      sectionId="ganka-releases"
    />
  );
}
