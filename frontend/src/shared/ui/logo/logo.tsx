import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { type IconName } from '@/shared/types';

import { AppLink } from '../app-link';
import { Icon } from '../icon';

interface ILogoProps {
  className?: string;
  variant?: Extract<IconName, 'logo-icon' | 'logo-text'>;
  aria?: string;
  children?: ReactNode;
  asLink?: boolean;
  onClick?: () => void;
}

export function Logo({
  variant = 'logo-icon',
  className,
  aria = '',
  children,
  asLink = false,
  onClick,
}: ILogoProps) {
  const containerClassName = cn(
    'group inline-flex items-center justify-center fill-[#231F20]',
    className,
  );

  const content = (
    <>
      <Icon
        name={variant}
        className={cn(
          'custom-transition transition-color h-full w-full stroke-none group-hover:fill-[#231F20]',
          asLink ? 'group-hover:text-brand' : '',
        )}
      />
      {children}
    </>
  );

  if (asLink) {
    return (
      <AppLink
        href="/"
        className={containerClassName}
        aria-label={aria || 'go to home'}
        onClick={onClick}
      >
        {content}
      </AppLink>
    );
  }

  return (
    <div className={containerClassName} aria-label={aria}>
      {content}
    </div>
  );
}
