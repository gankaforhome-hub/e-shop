import { cva, VariantProps } from 'class-variance-authority';
import { FC, InputHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export const inputVariants = cva(
  'text-text text-fg ftext-4/5 custom-transition fpx-1/2 fpy-2/4 inline-flex w-full min-w-0 bg-transparent outline-none transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'h-10',
        newsSubscription: 'bg-bg-accent ftext-4/4.5 h-8',
        lg: 'h-12 text-base',
      },
      border: {
        bottom: 'border-b-1 border-border',
      },
    },
    defaultVariants: {
      variant: 'newsSubscription',
      border: 'bottom',
    },
  },
);

export interface IInputProps
  extends
    InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  className?: string;
}

export const Input: FC<IInputProps> = ({
  className,
  variant,
  border,
  ...props
}) => {
  return (
    <>
      <input
        className={cn(inputVariants({ variant, border, className }))}
        {...props}
      />
    </>
  );
};

// file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs flex h-9  rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
//         'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
//         'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
