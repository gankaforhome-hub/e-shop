import { type LabelHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export interface ILabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  children: string;
  required?: boolean;
  className?: string;
}

export function Label({
  htmlFor,
  children,
  required,
  className,
  ...props
}: ILabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-foreground font-caption mb-2 ml-1 inline-flex select-none text-base xl:text-lg',
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5">*</span>}
    </label>
  );
}
