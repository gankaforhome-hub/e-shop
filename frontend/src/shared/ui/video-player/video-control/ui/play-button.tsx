import { type ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

export interface IPlayButtonProps extends ComponentProps<typeof Button> {
  isPlaying: boolean;
  onTogglePlay: () => void;
  theme?: 'white' | 'black';
}

export function PlayButton({
  isPlaying,
  onTogglePlay,
  className,
  theme = 'white',
  ...props
}: IPlayButtonProps) {
  const themeIconClass = cn(
    'size-6',
    theme === 'white'
      ? 'fill-none stroke-icon-secondary hover:fill-icon-secondary focus:fill-icon-secondary'
      : 'stroke-icon hover:fill-icon focus:fill-icon',
  );

  return (
    <Button
      variant="iconPrimary"
      size="icon"
      onClick={onTogglePlay}
      aria-label={isPlaying ? 'Pause video' : 'Play video'}
      className={cn(className)}
      {...props}
    >
      <Icon name={isPlaying ? 'pause' : 'play'} className={themeIconClass} />
    </Button>
  );
}
