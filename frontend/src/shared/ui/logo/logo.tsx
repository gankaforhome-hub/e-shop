import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { IconName } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';

interface ILogoProps {
  className?: string;
  variant?: Extract<IconName, 'logoFull' | 'logoMin'>;
  aria?: string;
}

export const Logo: FC<ILogoProps> = ({
  variant = 'logoFull',
  className,
  aria = '',
}) => {
  return (
    <AppLink
      href="/"
      className={cn('group items-center justify-center', className)}
      aria-label={aria}
    >
      <Icon
        name={variant}
        className="text-fg fh-5/7 custom-transition w-full transition-transform group-hover:scale-105"
      />
    </AppLink>
  );
};
