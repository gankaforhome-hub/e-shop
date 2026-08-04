import { type ComponentPropsWithRef } from 'react';

export interface IVideoProps extends ComponentPropsWithRef<'video'> {
  src: string;
  poster: string;
}

export function Video({
  src,
  className,
  preload = 'none',
  controls = false,
  autoPlay = false,
  muted = true,
  loop = false,
  poster = '',
  playsInline = true,
  ref,
  ...props
}: IVideoProps) {
  return (
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
      poster={poster}
      {...props}
    />
  );
}
