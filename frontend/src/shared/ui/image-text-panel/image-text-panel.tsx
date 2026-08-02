import { cn } from '@/shared/lib/utils';
import { type ImagePosition, type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';
import { Box } from '@/shared/ui/box';
import { Text } from '@/shared/ui/text';

export type ImageTextPanelContent = {
  image: Media;
  imagePosition: ImagePosition;
  paragraphs: string;
};
interface IImageTextPanelProps extends ImageTextPanelContent {
  className?: string;
}

export function ImageTextPanel({
  image,
  paragraphs,
  imagePosition,
  className,
}: IImageTextPanelProps) {
  return (
    <Box className={cn('fgap-4/6 flex flex-col lg:flex-row', className)}>
      <Box
        className={`min-h-85 shadow-card lg:aspect-868/891 relative aspect-square w-full overflow-hidden rounded-xl ${
          imagePosition === 'right' ? 'lg:order-2' : ''
        }`}
      >
        <AppMedia
          src={image.src}
          alt={image.alt || ''}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          loading="eager"
        />
      </Box>

      <Box
        className={`bg-muted 2xl:py-30 flex w-full flex-col justify-center gap-4 rounded-xl px-4 py-6 md:px-6 lg:px-5 lg:py-5 xl:px-10 xl:py-10 2xl:gap-8 2xl:px-20 ${
          imagePosition === 'right' ? 'lg:order-1' : ''
        }`}
      >
        {paragraphs.split('\n\n').map((paragraph, index) => (
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
