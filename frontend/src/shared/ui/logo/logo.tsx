import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { IconName } from '@/shared/types';
import { AppLink } from '../app-link';
import { Icon } from '../icon';

interface ILogoProps {
  className?: string;
  variant?: Extract<IconName, 'logo' | 'logoFooter'>;
  aria?: string;
  children?: ReactNode;
}

export const Logo: FC<ILogoProps> = ({
  variant = 'logo',
  className,
  aria = '',
  children,
}) => {
  return (
    <AppLink
      href="/"
      className={cn('group inline-flex items-center justify-center', className)}
      aria-label={aria}
    >
      <Icon
        name={variant}
        className="custom-transition group-hover:text-logo transition-color h-full w-full stroke-none"
      />
      {children}
    </AppLink>
  );
};
