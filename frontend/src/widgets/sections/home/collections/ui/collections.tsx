import { FC } from 'react';

import { CollectionCard } from '@/entities/collection';
import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';
import { MediaSlide } from '@/widgets/media-slide';

import { collections } from '../config/collection-data';

interface ICollectionProps {
  className?: string;
}

export const Collections: FC<ICollectionProps> = ({ className }) => {
  return (
    <>
      <Section className="pb-15 pt-5">
        <Container>
          <Heading headingLevel="h2" visibility="hidden">
            Ganka for Home collection
          </Heading>
          <ul className={cn('grid gap-12 md:grid-cols-2 md:gap-5', className)}>
            {collections.map(collection => (
              <li key={collection.id} className="group">
                <CollectionCard collection={collection} className="">
                  {/* <Box className="bg-radial from-bg to-bg-accent flex h-full w-full items-center justify-center rounded-3xl from-20% px-14 py-20"> */}
                  <Box className="collection-bg flex h-full w-full items-center justify-center rounded-3xl px-14 py-20">
                    <MediaSlide
                      type={collection.media.type}
                      src={collection.media.src}
                      alt={collection.media.alt ?? ''}
                      poster={collection.media.poster ?? ''}
                      width={470}
                      height={470}
                      sizes="(max-width: 768px) 230px, 470px"
                      className="max-h-115 max-w-115 custom-transition object-contain transition-transform group-hover:scale-110"
                    />
                  </Box>
                </CollectionCard>
                <AppLink href={routes.collection(collection.slug)}>
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
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
};
