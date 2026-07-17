import { type FC } from 'react';

import { CollectionCard } from '@/entities/collection';
import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { MediaSlide } from '@/widgets/media-slide';

import { collections } from '../config/collection-data';

interface ICollectionProps {
  className?: string;
}

export const Collections: FC<ICollectionProps> = ({ className }) => {
  return (
    <>
      <Section className="pb-15 pt-5 lg:py-12">
        <Container>
          <Heading headingLevel="h2" visibility="hidden">
            Ganka for Home collection
          </Heading>
          <ul
            className={cn(
              'grid gap-12 sm:grid-cols-2 sm:gap-2 md:gap-5',
              className,
            )}
          >
            {collections.map(collection => (
              <li key={collection.id} className="group">
                <CollectionCard collection={collection} className="">
                  <Box className="collection-bg flex h-full w-full flex-col items-center justify-center rounded-3xl px-14 py-20 sm:p-14">
                    <MediaSlide
                      type={collection.media.type}
                      src={collection.media.src}
                      alt={collection.media.alt ?? ''}
                      poster={collection.media.poster ?? ''}
                      width={470}
                      height={470}
                      sizes="(max-width: 768px) 230px, 470px"
                      className={cn(
                        'max-h-115 max-w-115 custom-transition object-contain transition-transform group-hover:scale-110',
                      )}
                    />
                  </Box>
                </CollectionCard>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
};
