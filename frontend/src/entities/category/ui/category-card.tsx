import { type CategorySlug, routes } from '@/shared/config/routes';
import { type Media } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';

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
      <div className="duration-(--dur-slow) ease-subtle relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-[#F4F5F7] p-2.5 transition-all group-hover:bg-[#EAECEF] group-hover:shadow-md sm:size-28 sm:p-4 lg:size-36 xl:size-40">
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <AppMedia
            src={image.src}
            alt={image.alt || ''}
            fill
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 160px"
            className="duration-(--dur-slow) ease-subtle object-contain object-center transition-transform group-hover:scale-105"
          />
        </div>
      </div>
      <span className="text-foreground group-hover:text-foreground/70 duration-(--dur-slow) ease-subtle text-sm font-medium transition-colors sm:text-base lg:text-lg xl:text-xl">
        {title}
      </span>
    </AppLink>
  );
}
