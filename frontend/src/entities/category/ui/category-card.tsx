import { routes } from '@/shared/config/routes';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { Box } from '@/shared/ui/box';

import { type Category } from '../model/types';

interface ICategoryCard extends Category {
  className?: string;
}

export function CategoryCard({ slug, title, image }: ICategoryCard) {
  return (
    <AppLink
      href={routes.products({ category: slug })}
      className="group flex flex-col items-center gap-3 text-center focus:outline-none"
    >
      <Box className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#F4F5F7] p-2.5 transition-all duration-300 group-hover:bg-[#EAECEF] group-hover:shadow-md sm:h-28 sm:w-28 sm:p-4 lg:h-36 lg:w-36 xl:h-40 xl:w-40">
        <Box className="relative h-full w-full overflow-hidden rounded-full">
          <AppMedia
            src={image.src}
            alt={image.alt || ''}
            fill
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 160px"
            className="object-contain object-center transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </Box>
      </Box>
      <span className="text-text-primary text-sm font-medium transition-colors duration-200 group-hover:text-black sm:text-base lg:text-lg xl:text-xl">
        {title}
      </span>
    </AppLink>
  );
}
