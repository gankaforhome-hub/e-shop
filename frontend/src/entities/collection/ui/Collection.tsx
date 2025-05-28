import { FC, ReactNode } from 'react';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { Collection } from '../model/types';

interface ICollectionCardProps {
  className?: string;
  collection: Collection;
  children: ReactNode;
}

export const CollectionCard: FC<ICollectionCardProps> = ({
  collection,
  className,
  children,
}) => {
  return (
    <AppLink
      href={routes.collection(collection.slug)}
      className={cn(
        'h-full w-full flex-col items-center justify-center',
        className,
      )}
    >
      {children}
      <Heading
        headingLevel="h3"
        variant="card"
        className="mt-8 text-center transition-opacity group-hover:opacity-70"
      >
        {collection.title}
      </Heading>
      <Text
        as="span"
        className="leading-0 group-hover:text-fg-accent custom-transition mx-auto flex items-center justify-center gap-2 text-base transition-colors"
      >
        View Now
        <Icon
          name="arrow"
          className="group-hover:stroke-icon-accent custom-transition h-3 rotate-180"
        />
      </Text>
    </AppLink>
  );
};
