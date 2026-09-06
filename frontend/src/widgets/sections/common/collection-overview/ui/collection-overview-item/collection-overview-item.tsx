import { AppMedia } from '@/shared/ui/app-media';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

import { type ICollectionOverviewItem } from '../../model';

interface ICollectionOverviewItemProps extends ICollectionOverviewItem {
  className?: string;
}

export const CollectionOverviewItem = ({
  title,
  paragraphs,
  image,
}: ICollectionOverviewItemProps) => {
  return (
    <article className="flex w-full flex-col-reverse gap-6 md:flex-row md:items-start md:gap-10 xl:gap-14">
      <div className="w-full shrink-0 md:w-1/3">
        <AppMedia
          src={image.src || ''}
          alt={image.alt || ''}
          width={600}
          height={678}
          className="shadow-card w-full object-cover max-md:aspect-square"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 600px"
        />
      </div>
      <div className="flex w-full flex-col space-y-2 md:w-2/3 md:pt-1">
        <Heading
          headingLevel="h3"
          variant="textPanel"
          className="mb-6 font-medium max-md:text-center"
        >
          {title}
        </Heading>
        <div className="space-y-3">
          {paragraphs.split('\n\n').map((text, index) => (
            <Text key={index}>{text}</Text>
          ))}
        </div>
      </div>
    </article>
  );
};
