import { type LabelHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

interface ILabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export function Label({ className, ...props }: ILabelProps) {
  return <label className={cn('', className)} {...props} />;
}
