import { FC } from 'react';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Heading } from '@/shared/ui/heading';

import { Box } from '@/shared/ui/box';
import Image from 'next/image';
import { Collection } from '../model/types';

interface ICollectionCardProps {
  className?: string;
  collection: Collection;
}

export const CollectionCard: FC<ICollectionCardProps> = ({
  collection,
  className,
}) => {
  return (
    <AppLink
      href={routes.collection(collection.slug)}
      className={cn(
        'h-full w-full flex-col items-center justify-center',
        className,
      )}
    >
      <Box className="aspect-36/40 relative w-full overflow-hidden rounded-xl">
        <Image
          src={collection.media.src}
          alt={collection.media.alt || collection.title}
          fill
          className="object-cover object-center transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Box>
      <Heading
        headingLevel="h2"
        variant="cardItem"
        className="fmt-4/6 text-center capitalize"
      >
        {collection.title}
      </Heading>
    </AppLink>
  );
};
