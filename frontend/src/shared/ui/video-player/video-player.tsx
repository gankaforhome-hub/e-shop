'use client';
import { type FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Overlay } from '@/shared/ui/overlay';
import { type IVideoProps, Video } from '@/shared/ui/video';

import { MuteButton, PlayButton, useVideoControl } from './video-control';

interface IVideoPlayerProps extends IVideoProps {
  showPlay?: boolean;
  showMute?: boolean;
  className: string;
  isPaused?: boolean;
  overlay?: boolean;
}

export const VideoPlayer: FC<IVideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  loop = false,
  showPlay = true,
  showMute = true,
  //   showProgressBar = true,
  className,
  overlay = false,
  // isPaused = false,
}) => {
  const {
    videoRef,
    isMuted,
    isPlaying,
    togglePlay,
    toggleMute,
    // progress,
    // handleTimeUpdate,
  } = useVideoControl();

  return (
    <Box className="group relative inset-0 h-full w-full">
      <Video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        onClick={togglePlay}
        // onTimeUpdate={handleTimeUpdate}
        className={cn(className)}
      />
      {overlay && !isPlaying && <Overlay />}

      {showPlay && (
        <PlayButton
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          className="absolute bottom-6 right-4 z-50 -translate-y-1/2"
        />
      )}
      {showMute && (
        <MuteButton
          isMuted={isMuted}
          onToggleMute={toggleMute}
          className="absolute bottom-6 left-4 z-50 -translate-y-1/2"
        />
      )}
      {/* {showProgressBar && (
            <ProgressBar
              progress={progress}
              className="h-1 w-full bg-white/30"
            />
          )} */}
    </Box>
  );
};
