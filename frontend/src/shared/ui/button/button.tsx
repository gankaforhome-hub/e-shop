import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, FC } from 'react';

import { cn } from '@/shared/lib/utils';

export const buttonVariants = cva(
  'font-button custom-transition disabled:disable ftext-4/5 fleading-6/7 m-0 inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-xl border-0 p-4 font-normal tracking-wide outline-none transition hover:shadow-lg focus:shadow-lg disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default:
          'text-btn-fg-primary bg-btn-bg-primary disabled:bg-btn-bg-primary-disabled disabled:text-btn-fg-primary-disabled hover:bg-btn-bg-primary-hover focus:bg-btn-bg-primary-hover',
        outline:
          'border-border text-btn-fg-secondary bg-btn-bg-outline disabled:bg-btn-outline-disabled disabled:text-btn-fg-secondary-disabled hover:border-border-btn-bg-hover focus:border-border-btn-bg-hover border-2 border-solid',
        //TODO add styles for link
        icon: 'group shrink-0 border-0',
        link: 'text-btn-fg-primary bg-btn-bg-primary disabled:bg-btn-bg-primary-disabled disabled:text-btn-fg-primary-disabled hover:bg-btn-bg-primary-focus focus:bg-btn-bg-primary-focus',
      },
      size: {
        sm: 'px-5 py-4',
        lg: 'max-w-75',
        xl: 'max-w-130',
        spaced: 'justify-between px-5 py-4',
        icon: 'p-1',
      },
      border: {
        border: 'border-border border border-solid',
      },
      btnType: {
        button: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
      btnType: 'button',
    },
    compoundVariants: [
      { variant: 'icon', class: 'border-0' },
      // { variant: "addToBag", size: "default", class: "w-full" },
      // { btnType: "icon", size: "xl", class: "h-12 w-12" },
    ],
  },
);
export interface IButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
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
