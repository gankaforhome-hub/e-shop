import { cn } from '@/shared/lib/utils';
import { AppMedia } from '@/shared/ui/app-media';

import { type ImageAsset } from '../../../api';

interface IGalleryList {
  images: ImageAsset[];
  className?: string;
}

export function GalleryList({ images, className }: IGalleryList) {
  return (
    <>
      <ul role="list" className={cn('grid grid-cols-4 gap-4', className)}>
        {images.map(image => (
          <li
            key={image.src}
            className="shadow-card hover:scale-102 relative aspect-square overflow-hidden rounded-xl transition-transform duration-300"
          >
            <AppMedia
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1280px) 24vw, 100vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </>
  );
}
