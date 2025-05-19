'use client';
import { FC } from 'react';

import {
  MuteButton,
  PlayButton,
  useVideoControl,
} from '@/features/video-control';
import { Box } from '@/shared/ui/box';
import { IVideoProps, Video } from '@/shared/ui/video';

interface IVideoPlayerProps extends IVideoProps {
  showPlay?: boolean;
  showMute?: boolean;
  className: string;
  isPaused?: boolean;
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
  isPaused = false,
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
    <Box className="group absolute h-full w-full">
      <Video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        onClick={togglePlay}
        // onTimeUpdate={handleTimeUpdate}
        className={className}
      />

      {showPlay && (
        <PlayButton
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          className="absolute bottom-6 right-4"
        />
      )}
      {showMute && (
        <MuteButton
          isMuted={isMuted}
          onToggleMute={toggleMute}
          className="absolute bottom-6 left-4"
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
