import Image, { type ImageProps } from 'next/image';

import { cn, isVideoUrl, shimmer } from '@/shared/lib/utils';
import { Overlay } from '@/shared/ui/overlay';
import { VideoPlayer } from '@/shared/ui/video-player';

import { Box } from '../box';

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export interface IAppMedia extends Omit<
  ImageProps,
  'src' | 'alt' | 'width' | 'height'
> {
  src: string;
  alt?: string;
  poster?: string;
  width?: number;
  height?: number;
  overlay?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
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
  ...restProps
}: IAppMedia) {
  const isVideo = isVideoUrl(src);
  const baseClass = cn('object-cover object-center w-full h-full', className);

  // Готуємо контент
  let mediaContent: React.ReactNode;

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
    const blurWidth = width ? Number(width) : 700;
    const blurHeight = height ? Number(height) : 475;
    const blurDataURL = `data:image/svg+xml;base64,${toBase64(
      shimmer(blurWidth, blurHeight),
    )}`;

    mediaContent = (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={baseClass}
        {...(!fill && width && height ? { width, height } : {})}
        {...(blurDataURL ? { placeholder: 'blur', blurDataURL } : {})}
        {...restProps}
      />
    );
  }

  if (!overlay) {
    return mediaContent;
  }

  return (
    <Box
      className={cn(
        'relative overflow-hidden',
        fill && 'absolute inset-0 h-full w-full',
      )}
    >
      {mediaContent}
      <Overlay />
    </Box>
  );
}
