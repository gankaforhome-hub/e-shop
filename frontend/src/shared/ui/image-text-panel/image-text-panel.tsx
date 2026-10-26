import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { type ImagePosition, type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';
import { Text } from '@/shared/ui/text';

// `fluid` scales with the viewport for prose; `form` keeps inputs comfortable
const TEXT_PADDING = {
  fluid: 'fpy-6/30 fpx-6/30',
  form: 'p-4 sm:p-6 md:p-8 lg:p-10',
} as const;

export type ImageTextPanelContent = {
  image: Media;
  imagePosition: ImagePosition;
  paragraphs?: string;
  children?: ReactNode;
};
interface IImageTextPanelProps extends ImageTextPanelContent {
  className?: string;
  imageContainerClassName?: string;
  imageClassName?: string;
  textClassName?: string;
  padding?: keyof typeof TEXT_PADDING;
  /** Must match the layout switch (`lg` by default). */
  imageSizes?: string;
  priority?: boolean;
}

export function ImageTextPanel({
  image,
  paragraphs = '',
  imagePosition = 'left',
  children,
  className,
  imageClassName,
  imageContainerClassName,
  textClassName,
  padding = 'fluid',
  imageSizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
}: IImageTextPanelProps) {
  return (
    <div
      className={cn(
        'mt-4 flex flex-col gap-4 md:mt-8 md:gap-1 lg:mt-10 lg:flex-row xl:mt-16',
        className,
      )}
    >
      <div
        className={cn(
          'min-h-85 relative aspect-square w-full lg:min-w-0 lg:basis-1/2',
          imagePosition === 'right' ? 'lg:order-2' : '',
          imageContainerClassName,
        )}
      >
        <AppMedia
          src={image.src || ''}
          alt={image.alt || ''}
          fill
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          className={cn('object-cover object-center', imageClassName)}
          sizes={imageSizes}
        />
      </div>

      <div
        className={cn(
          'bg-muted flex w-full flex-col justify-center gap-4 lg:min-w-0 lg:basis-1/2 2xl:gap-8',
          TEXT_PADDING[padding],
          imagePosition === 'right' ? 'lg:order-1' : '',
          textClassName,
        )}
      >
        {children ??
          paragraphs.split('\n\n').map((paragraph, index) => (
            <Text key={index} className="max-lg:text-wrap">
              {paragraph}
            </Text>
          ))}
      </div>
    </div>
  );
}
