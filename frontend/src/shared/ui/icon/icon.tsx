import { FC, ReactNode, type SVGProps } from 'react';

import { cn } from '@/shared/lib/utils';
import { type IconName } from '@/shared/types';

interface IIconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
  childClassName?: string;
  children?: ReactNode;
}

export const Icon: FC<IIconProps> = ({
  name,
  className = '',
  childClassName = '',
  children,
  ...props
}) => {
  if (children) {
    return (
      <span
        className={cn(
          `font-text inline-flex shrink-0 items-center gap-2.5`,
          childClassName,
        )}
      >
        {children}
        <Icon name={name} className={className} {...props} />
      </span>
    );
  }
  return (
    <svg
      {...props}
      className={cn(
        'stroke-icon fh-4/4 fw-4/4 inline shrink-0 self-center',
        className,
      )}
    >
      <use href={`./icons/sprite.svg#${name}`} />
    </svg>
  );
};
