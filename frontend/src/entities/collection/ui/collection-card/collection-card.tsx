import { type CollectionDTO } from '@/entities/collection/api/get-collections';
import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { Heading } from '@/shared/ui/heading';

interface ICollectionCardProps {
  collection: CollectionDTO;
  className?: string;
}

export function CollectionCard({
  collection,
  className,
}: ICollectionCardProps) {
  return (
    <AppLink
      href={routes.collection(collection.slug)}
      className={cn('group h-full w-full flex-col', className)}
    >
      <div className="aspect-570/585 relative w-full overflow-hidden">
        <AppMedia
          src={collection.media.src}
          alt={collection.media.alt || collection.title}
          fill
          className="duration-(--dur-slow) ease-subtle object-contain transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <Heading
        headingLevel="h2"
        variant="collectionCard"
        className={cn(
          'mt-4 line-clamp-1 text-center capitalize lg:mt-6',
          'group-hover:text-foreground/70 text-foreground duration-(--dur-slow) ease-subtle transition-colors',
        )}
      >
        {collection.title}
      </Heading>
    </AppLink>
  );
}
