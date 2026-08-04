'use client';

import { cn } from '@/shared/lib/utils';
import { Overlay } from '@/shared/ui/overlay';
import { type IVideoProps, Video } from '@/shared/ui/video';

import { MuteButton, PlayButton, useVideoControl } from './video-control';

export interface IVideoPlayerProps extends IVideoProps {
  showPlay?: boolean;
  showMute?: boolean;
  overlay?: boolean;
}

export function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  loop = false,
  showPlay = true,
  showMute = true,
  className,
  overlay = false,
  ...props
}: IVideoPlayerProps) {
  const {
    videoRef,
    isMuted,
    isPlaying,
    togglePlay,
    toggleMute,
    handlePlay,
    handlePause,
  } = useVideoControl();

  return (
    <div className="group relative h-full w-full overflow-hidden">
      <Video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        onClick={togglePlay}
        onPlay={handlePlay}
        onPause={handlePause}
        className={cn('h-full w-full object-cover', className)}
        {...props}
      />

      {overlay && !isPlaying && <Overlay />}

      {showPlay && (
        <PlayButton
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          className="absolute bottom-6 right-4 z-10"
        />
      )}

      {showMute && (
        <MuteButton
          isMuted={isMuted}
          onToggleMute={toggleMute}
          className="absolute bottom-6 left-4 z-10"
        />
      )}
    </div>
  );
}
