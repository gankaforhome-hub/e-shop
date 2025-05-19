import { FC } from 'react';

interface IVideoProps {
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

export const Video: FC<IVideoProps> = ({
  src,
  className,
  preload = 'none',
  controls = false,
  autoPlay = false,
  muted = true,
  loop = false,
  poster = '',
  playsInline = true,
}) => {
  return (
    <>
      <video
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
};
