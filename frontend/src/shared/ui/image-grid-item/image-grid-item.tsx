import { cn } from '@/shared/lib/utils';
import { AppMedia } from '@/shared/ui/app-media';
import { Box } from '@/shared/ui/box';

type ImageItem = {
  src: string;
  alt: string;
};
interface IImageGridItem {
  image: ImageItem;
  aspect: string;
  items: 1 | 2 | 3 | 4;
}

const sizesByCount = {
  1: '100vw',
  2: '(min-width: 768px) 45vw, 95vw',
  3: '(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 95vw',
  4: '(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 95vw',
};

export function ImageGridItem({ image, aspect, items }: IImageGridItem) {
  const sizes = items ?? sizesByCount[items];

  return (
    <Box
      className={cn('relative overflow-hidden', aspect, 'rounded-card group')}
    >
      <AppMedia
        {...image}
        fill
        sizes={sizes.toString()}
        className={cn(
          'object-cover',
          'transition-transform duration-500 ease-out group-hover:scale-105',
        )}
      />
    </Box>
  );
}
