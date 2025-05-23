'use client';
import Image from 'next/image';
import { FC } from 'react';

import { cn, getBase64, shimmer } from '@/shared/lib/utils';
import { Overlay } from '@/shared/ui/overlay';
import { VideoPlayer } from '@/widgets/video-player';

type MediaType = 'image' | 'video';

export interface IMediaSlideProps {
  type: MediaType;
  src: string;
  alt: string;
  poster: string;
  className?: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  overlay?: boolean;
}

export const MediaSlide: FC<IMediaSlideProps> = ({
  type,
  src,
  alt,
  poster,
  className,
  width,
  height,
  sizes,
  priority = false,
  overlay = false,
}) => {
  const baseClass = cn('object-cover object-center  w-full h-full ', className);

  if (type === 'image') {
    return (
      <>
        <Image
          src={src}
          alt={alt ?? ''}
          width={width}
          height={height}
          sizes={sizes}
          className={baseClass}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${getBase64(shimmer(700, 475))}`}
          priority={priority}
        />
        {overlay && <Overlay />}
      </>
    );
  }

  return (
    <VideoPlayer
      src={src}
      poster={poster}
      className={baseClass}
      overlay={overlay}
    />
  );
};
