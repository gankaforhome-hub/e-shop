import { type ICollectionOverviewItem } from '../../model';
import { CollectionOverviewItem } from '../collection-overview-item/collection-overview-item';

interface ICollectionOverviewListProps {
  releases: ICollectionOverviewItem[];
}

export const CollectionOverviewList = ({
  releases,
}: ICollectionOverviewListProps) => {
  return (
    <ul className="flex flex-col gap-8 md:gap-12 xl:gap-16">
      {releases.map((release, idx) => (
        <li key={`${release.title}-${idx}`}>
          <CollectionOverviewItem {...release} />
        </li>
      ))}
    </ul>
  );
};
