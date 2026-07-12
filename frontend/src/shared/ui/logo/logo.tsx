import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { IconName } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';

interface ILogoProps {
  className?: string;
  variant?: Extract<IconName, 'logo'>;
  aria?: string;
}

export const Logo: FC<ILogoProps> = ({
  variant = 'logo',
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
        className="custom-transition fw-10/16 fh-10/16 group-hover:text-icon-accent transition-color"
      />
    </AppLink>
  );
};
