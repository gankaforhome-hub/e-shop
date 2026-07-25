import { cn } from '@/shared/lib/utils';
import { type ImageAsset } from '@/shared/types';
import { ImageGridItem } from '@/shared/ui/image-grid-item';

interface IGalleryList {
  images: ImageAsset[];
  className?: string;
}

export function GalleryList({ images, className }: IGalleryList) {
  return (
    <>
      <ul role="list" className={cn('grid grid-cols-4 gap-4', className)}>
        {images.map(image => (
          <li key={image.src}>
            <ImageGridItem
              image={{ ...image }}
              aspect="aspect-square"
              items={4}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
