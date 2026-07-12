import { cva, VariantProps } from 'class-variance-authority';
import { FC, HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export const textVariants = cva(
  'font-text text-base font-normal tracking-normal',
  {
    variants: {
      variant: {
        default: 'text-fg',
        secondary: 'text-fg-secondary text-lg tracking-wider',
        accent: 'text-fg-accent',
        danger: 'text-red-600',
        inherit: 'text-inherit',
      },
      // size: {
      //   xs: 'text-xs',
      //   sm: 'text-sm',
      //   md: 'text-base',
      //   lg: 'text-lg',
      //   xl: 'text-xl',
      //   '2xl': 'text-2xl',
      // },
      // weight: {
      //   normal: "font-normal",
      //   medium: "font-medium",
      //   semibold: "font-semibold",
      //   bold: "font-bold",
      // },
      // align: {
      //   left: "text-left",
      //   center: "text-center",
      //   right: "text-right",
      //   justify: "text-justify",
      // },
    },

    defaultVariants: {
      variant: 'default',
      // size: 'md',
      // weight: "normal",
      // align: "left",
    },
    compoundVariants: [
      // { variant: "default", size: "lg", class: "h-10 w-10" },
    ],
  },
);

interface ITextProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  className?: string;
  as?: 'p' | 'span';
}

export const Text: FC<ITextProps> = ({
  className,
  variant,
  // size,
  as = 'p',
  ...props
}) => {
  const Component = as;
  return (
    <Component
      className={cn(textVariants({ variant, className }))}
      {...props}
    />
  );
};
