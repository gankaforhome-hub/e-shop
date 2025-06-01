import { FC, LabelHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

interface ILabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export const Label: FC<ILabelProps> = ({ className, ...props }) => {
  return <label className={cn('', className)} {...props} />;
};
