import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

interface IPlayButtonProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  className?: string;
  theme?: 'white' | 'black';
}

export const PlayButton: FC<IPlayButtonProps> = ({
  isPlaying,
  onTogglePlay,
  className,
  theme = 'white',
}) => {
  const themeIcon = cn(
    'w-6 h-6 fill-none ',
    theme === 'white'
      ? 'fill-none hover:fill-icon-secondary focus:fill-icon-secondary stroke-icon-secondary'
      : 'hover:fill-icon focus:fill-icon stroke-icon',
  );
  return (
    <Button
      variant="icon"
      size="icon"
      onClick={onTogglePlay}
      className={cn(className)}
    >
      {isPlaying ? (
        <Icon name="pause" className={themeIcon} />
      ) : (
        <Icon name="play" className={themeIcon} />
      )}
    </Button>
  );
};
