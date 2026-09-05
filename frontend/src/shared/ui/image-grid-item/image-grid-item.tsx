import { cn } from '@/shared/lib/utils';
import { type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';

export interface IImageGridItemProps {
  image: Media;
  aspect: string;
  items: 1 | 2 | 3 | 4;
  className?: string;
}

const sizesByCount = {
  1: '100vw',
  2: '(min-width: 768px) 45vw, 95vw',
  3: '(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 95vw',
  4: '(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 95vw',
};

export function ImageGridItem({
  image,
  aspect,
  items = 1,
  className,
}: IImageGridItemProps) {
  const sizes = sizesByCount[items];

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden',
        aspect,
        'group',
        className,
      )}
    >
      <AppMedia
        {...image}
        fill
        sizes={sizes.toString()}
        className={cn(
          'object-cover object-center',
          'h-full w-full transition-transform duration-500 ease-out group-hover:scale-105',
        )}
      />
    </div>
  );
}
