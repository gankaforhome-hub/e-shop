import { useCallback, useRef, useState } from 'react';

export function useVideoControl() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.play();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
      setIsMuted(false);
    }
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  return {
    videoRef,
    isPlaying,
    isMuted,
    progress,
    play,
    pause,
    togglePlay,
    toggleMute,
    handleTimeUpdate,
  };
}
