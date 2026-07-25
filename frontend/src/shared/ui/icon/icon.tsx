import { type FC, type ReactNode, type SVGProps } from 'react';

import { cn } from '@/shared/lib/utils';
import { type IconName } from '@/shared/types';

interface IIconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
  childClassName?: string;
  children?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Icon: FC<IIconProps> = ({
  name,
  className = '',
  childClassName = '',
  iconPosition = 'right',
  children,
  ...props
}) => {
  if (children) {
    return (
      <span
        className={cn(
          `font-text inline-flex min-w-0 items-center gap-4 break-all`,
          iconPosition === 'right' ? 'flex-row' : 'flex-row-reverse',
          childClassName,
        )}
      >
        {children}
        <Icon
          name={name}
          className={cn(
            'custom-transition transition-colors group-hover:stroke-current',
            className,
          )}
          {...props}
        />
      </span>
    );
  }
  return (
    <svg
      {...props}
      className={cn(
        'transition-color custom-transition inline h-full w-full shrink-0 fill-none stroke-current',
        className,
      )}
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
};
