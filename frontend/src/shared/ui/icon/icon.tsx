import { FC, SVGProps } from 'react';

import { cn } from '@/shared/lib/utils';
import { IconName, icons } from '@/shared/types';

interface IIconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

export const Icon: FC<IIconProps> = ({ name, className = '', ...props }) => {
  const SvgIcon = icons[name];

  return (
    <SvgIcon
      className={cn(
        'stroke-icon h-4 w-4 shrink-0 overflow-visible fill-none',
        className,
      )}
      {...props}
    />
  );
};
