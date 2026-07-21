import { cn } from '@/shared/lib/utils';
import { AppMedia } from '@/shared/ui/app-media';
import { Box } from '@/shared/ui/box';
import { Text } from '@/shared/ui/text';

import type { ImageTextPanelContent } from '../api';

interface IImageTextPanel extends ImageTextPanelContent {
  className?: string;
}

//TODO move to a reusable component

export function ImageTextPanel({
  image,
  paragraphs,
  imagePosition,
  className,
}: IImageTextPanel) {
  return (
    <Box className={cn('fgap-4/6 flex flex-col lg:flex-row', className)}>
      <Box
        className={`min-h-85 shadow-card lg:aspect-868/891 relative aspect-square w-full overflow-hidden rounded-xl ${
          imagePosition === 'right' ? 'lg:order-2' : ''
        }`}
      >
        <AppMedia
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          loading="eager"
        />
      </Box>

      <Box
        className={`bg-surface-muted 2xl:py-30 flex w-full flex-col justify-center gap-4 rounded-xl px-4 py-6 md:px-6 lg:px-5 lg:py-5 xl:px-10 xl:py-10 2xl:gap-8 2xl:px-20 ${
          imagePosition === 'right' ? 'lg:order-1' : ''
        }`}
      >
        {paragraphs.map((paragraph, index) => (
          <Text
            key={index}
            font="secondary"
            size="main"
            className="max-lg:text-wrap"
          >
            {paragraph}
          </Text>
        ))}
      </Box>
    </Box>
  );
}
