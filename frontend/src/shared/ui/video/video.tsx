import { forwardRef, HTMLAttributes } from 'react';

export interface IVideoProps extends HTMLAttributes<HTMLVideoElement> {
  src: string;
  poster: string;
  preload?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  className?: string;
}

export const Video = forwardRef<HTMLVideoElement, IVideoProps>(
  (
    {
      src,
      className,
      preload = 'none',
      controls = false,
      autoPlay = false,
      muted = true,
      loop = false,
      poster = '',
      playsInline = true,
    },
    ref,
  ) => {
    return (
      <>
        <video
          ref={ref}
          src={src}
          preload={preload}
          className={className}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          poster={poster ?? ''}
        />
      </>
    );
  },
);

Video.displayName = 'Video';
