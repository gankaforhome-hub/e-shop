'use client';
import Image from 'next/image';
import { FC } from 'react';

import { cn, getBase64, shimmer } from '@/shared/lib/utils';
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
}) => {
  const baseClass = cn('object-cover object-center  w-full h-full', className);

  if (type === 'image') {
    return (
      <Image
        src={src}
        alt={alt ?? ''}
        width={width}
        height={height}
        sizes={sizes}
        className={baseClass}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${getBase64(shimmer(700, 475))}`}
      />
    );
  }

  return <VideoPlayer src={src} poster={poster} className={baseClass} />;
};
