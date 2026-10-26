import { type ReactNode } from 'react';

import Image, { type ImageProps } from 'next/image';

import { cn, isVideoUrl } from '@/shared/lib/utils';
import { Overlay } from '@/shared/ui/overlay';
import { VideoPlayer } from '@/shared/ui/video-player';

import { FadeImage } from './fade-image';

/**
 * Static 1×1 SVG in the shimmer base tone (#f6f7f8), ~170 bytes.
 * Replaces the per-image animated shimmer SVG; real blur comes via `blurDataURL`.
 */
const STATIC_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmNmY3ZjgiLz48L3N2Zz4=';

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
    // Above-the-fold images paint at once with the placeholder; lazy ones
    // fade in on load instead (their placeholder would be hidden anyway)
    const isEager =
      restProps.loading === 'eager' ||
      restProps.fetchPriority === 'high' ||
      Boolean(restProps.preload ?? restProps.priority);
    const finalBlurDataURL =
      blurDataURL || (placeholder === 'blur' ? STATIC_PLACEHOLDER : undefined);
    const imageProps: ImageProps = {
      src,
      alt,
      fill,
      sizes,
      className: baseClass,
      ...(!fill && width && height ? { width, height } : {}),
      ...restProps,
    };

    mediaContent = isEager ? (
      <Image
        {...imageProps}
        placeholder={placeholder}
        {...(finalBlurDataURL ? { blurDataURL: finalBlurDataURL } : {})}
      />
    ) : (
      <FadeImage {...imageProps} />
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
