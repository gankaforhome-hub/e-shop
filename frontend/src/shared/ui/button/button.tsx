import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, FC } from 'react';

import { cn } from '@/shared/lib/utils';

export const buttonVariants = cva(
  'font-button custom-transition m-0 inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap p-0 text-lg font-normal outline-none transition',
  {
    variants: {
      variant: {
        default: 'text-btn-fg-primary bg-btn-bg-primary hover:shadow-lg',
        secondary: 'text-btn-fg-secondary bg-btn-bg-secondary hover:shadow-lg',
        outline: 'text-btn-fg-primary bg-transparent hover:shadow-lg',
        ghost: 'text-btn-fg-ghost bg-btn-bg-ghost group hover:shadow-lg',
        icon: 'group shrink-0 border-0 p-1',
      },
      size: {
        default: 'px-5 py-4',
        sm: 'px-5 py-4',
        lg: 'px-14 py-5',
        xl: 'px-21 py-5',
        spaced: 'justify-between px-5 py-4',
        icon: 'h-6 w-6',
        // sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        // lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        // xl: "h-12 rounded-md px-8 has-[>svg]:px-6",
      },
      border: {
        border: 'border-border border-solid',
        withOutBorder: '',
      },
      btnType: {
        button: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      border: 'border',
      btnType: 'button',
    },
    compoundVariants: [
      { variant: 'icon', class: 'border-0 p-1' },
      // { variant: "addToBag", size: "default", class: "w-full" },
      // { btnType: "icon", size: "xl", class: "h-12 w-12" },
    ],
  },
);
export interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button: FC<IButtonProps> = ({
  className,
  variant,
  size,
  border,
  btnType,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <>
      <Comp
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size, border, btnType, className }),
        )}
        {...props}
      />
    </>
  );
};
