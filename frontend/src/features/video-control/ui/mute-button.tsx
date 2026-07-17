import { type FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

interface IMuteButtonProps {
  isMuted: boolean;
  onToggleMute: () => void;
  className?: string;
  theme?: 'white' | 'black';
}

export const MuteButton: FC<IMuteButtonProps> = ({
  isMuted,
  onToggleMute,
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
      onClick={onToggleMute}
      className={cn(className)}
    >
      {isMuted ? (
        <Icon name="mute" className={themeIcon} />
      ) : (
        <Icon name="sound" className={themeIcon} />
      )}
    </Button>
  );
};
