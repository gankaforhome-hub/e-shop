import { type CategorySlug, routes } from '@/shared/config/routes';
import { type Media } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { Text } from '@/shared/ui/text';

interface ICategoryCard {
  slug: CategorySlug;
  title: string;
  image: Media;
  className?: string;
}

export function CategoryCard({ slug, title, image }: ICategoryCard) {
  return (
    <AppLink
      href={routes.products({ category: slug })}
      className="group flex flex-col items-center gap-3 text-center focus:outline-none"
    >
      <div className="duration-(--dur-slow) ease-subtle relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-[#F4F5F7] p-2.5 transition-all group-hover:scale-105 group-hover:shadow-md sm:size-28 sm:p-5 lg:size-36 xl:size-40">
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <AppMedia
            src={image.src}
            alt={image.alt || ''}
            fill
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 160px"
            className="object-contain object-center"
          />
        </div>
      </div>
      <Text
        as="span"
        className="group-hover:text-foreground/90 duration-(--dur-slow) ease-subtle text-sm font-normal transition-colors sm:text-base lg:text-lg xl:text-xl"
      >
        {title}
      </Text>
    </AppLink>
  );
}
