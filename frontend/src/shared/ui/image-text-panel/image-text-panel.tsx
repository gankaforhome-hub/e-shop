import { cn } from '@/shared/lib/utils';
import { type ImagePosition, type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';
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
  paragraphs = '',
  imagePosition = 'left',
  className,
}: IImageTextPanelProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:gap-1 lg:flex-row',
        'mt-4 md:mt-8 lg:mt-10 xl:mt-16',
        className,
      )}
    >
      <div
        className={`min-h-85 lg:aspect-868/891 relative aspect-square w-full ${
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
      </div>

      <div
        className={`bg-muted 2xl:py-30 flex w-full flex-col justify-center gap-4 px-4 py-6 md:px-6 lg:px-5 lg:py-5 xl:px-10 xl:py-10 2xl:gap-8 2xl:px-20 ${
          imagePosition === 'right' ? 'lg:order-1' : ''
        }`}
      >
        {paragraphs.split('\n\n').map((paragraph, index) => (
          <Text key={index} className="max-lg:text-wrap">
            {paragraph}
          </Text>
        ))}
      </div>
    </div>
  );
}
