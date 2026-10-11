import { type ReactNode } from 'react';

import Image, { type ImageProps } from 'next/image';

import { cn, getBase64, isVideoUrl, shimmer } from '@/shared/lib/utils';
import { Overlay } from '@/shared/ui/overlay';
import { VideoPlayer } from '@/shared/ui/video-player';

export interface AppMediaProps extends Omit<
  ImageProps,
  'src' | 'alt' | 'width' | 'height' | 'placeholder' | 'blurDataURL'
> {
  src: string;
  alt?: string;
  poster?: string;
  width?: number;
  height?: number;
  overlay?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  placeholder?: ImageProps['placeholder'];
  blurDataURL?: string | undefined;
}

export function AppMedia({
  src,
  alt = '',
  poster,
  className,
  width,
  height,
  sizes = '100vw',
  overlay = false,
  fill = false,
  autoPlay = true,
  controls = false,
  placeholder = 'blur',
  blurDataURL,
  ...restProps
}: AppMediaProps) {
  const isVideo = isVideoUrl(src);

  const baseClass = cn('object-cover object-center w-full h-full', className);

  let mediaContent: ReactNode;

  if (isVideo) {
    mediaContent = (
      <VideoPlayer
        src={src}
        poster={poster || ''}
        className={baseClass}
        overlay={overlay}
        autoPlay={autoPlay}
        controls={controls}
      />
    );
  } else {
    const blurWidth = width ?? 475;
    const blurHeight = height ?? 475;

    const finalBlurDataURL =
      blurDataURL ||
      (placeholder === 'blur'
        ? `data:image/svg+xml;base64,${getBase64(
            shimmer(blurWidth, blurHeight),
          )}`
        : undefined);

    mediaContent = (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={baseClass}
        placeholder={placeholder}
        {...(finalBlurDataURL ? { blurDataURL: finalBlurDataURL } : {})}
        {...(!fill && width && height ? { width, height } : {})}
        {...restProps}
      />
    );
  }

  if (!overlay) {
    return mediaContent;
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        fill && 'absolute inset-0 h-full w-full',
      )}
    >
      {mediaContent}
      <Overlay />
    </div>
  );
}
