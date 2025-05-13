import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { LogoIcon } from '@/shared/types/icon';
import { Icon } from '@/shared/ui/icon';

interface ILogoProps {
  className?: string;
  variant?: LogoIcon;
  aria?: string;
}

export const Logo: FC<ILogoProps> = ({
  variant = 'logoFull',
  className,
  aria = '',
}) => {
  return (
    <Link
      href="/"
      className={cn(
        'fh-5/6 fw-48/56 inline-flex items-center justify-center',
        className,
      )}
      aria-label={aria}
    >
      <Icon name={variant} className="h-full w-full" />
    </Link>
  );
};
