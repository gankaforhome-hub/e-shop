import { type ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

export interface IMuteButtonProps extends ComponentProps<typeof Button> {
  isMuted: boolean;
  onToggleMute: () => void;
  theme?: 'white' | 'black';
}

export function MuteButton({
  isMuted,
  onToggleMute,
  className,
  theme = 'white',
  ...props
}: IMuteButtonProps) {
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
      onClick={onToggleMute}
      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      className={cn(className)}
      {...props}
    >
      <Icon name={isMuted ? 'mute' : 'volume'} className={themeIconClass} />
    </Button>
  );
}
