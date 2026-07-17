import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ButtonHTMLAttributes, type FC } from 'react';

import { cn } from '@/shared/lib/utils';
/** @type {*} */
const buttonVariants = cva(
  // Базові стилі: сучасний інтерактивний елемент
  'focus-visible:ring-ring inline-flex select-none items-center justify-center whitespace-nowrap text-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Default solid button
        default:
          'bg-btn-bg-primary text-btn-fg-primary hover:bg-btn-bg-primary-hover focus:bg-btn-bg-primary-hover disabled:bg-btn-bg-primary-disabled disabled:text-btn-fg-primary-disabled shadow-sm',
        // Outline button
        outline:
          'border-border bg-btn-bg-outline text-btn-fg-secondary hover:bg-btn-bg-hover hover:border-border-btn-bg-hover focus:border-border-btn-bg-hover disabled:bg-btn-outline-disabled disabled:text-btn-fg-secondary-disabled border-2 border-solid',
        // Link button (for navigation/routing)
        link: 'text-btn-fg-primary bg--bg-primary inline h-auto w-auto p-0 underline-offset-4 hover:underline focus-visible:underline',
        // Icon button (for carousels, UI actions)
        icon: 'text-btn-fg-secondary hover:bg-btn-bg-hover hover:text-btn-fg-primary border-0 bg-transparent active:scale-95',

        dot: 'bg-btn-dot-inactive-primary hover:bg-btn-dot-hover aria-current:bg-btn-dot-active-primary data-[active=true]:bg-btn-dot-active-primary h-2 w-2 shrink-0 rounded-full p-0 transition-colors duration-200 md:h-3 md:w-3',

        dotSecondary:
          'bg-btn-dot-inactive-secondary hover:bg-btn-dot-hover aria-current:bg-btn-dot-active-secondary data-[active=true]:bg-btn-dot-active-secondary h-3 w-3 shrink-0 rounded-full p-0 transition-colors duration-200',
      },
      size: {
        base: 'w-75 rounded-xl p-4',
        // --- Semantic adaptive sizes for e-commerce ---

        // "Buy" button (full-width on mobile, 300px on desktop)
        buy: 'md:h-13 h-12 w-full rounded-xl px-6 text-base md:w-[300px]',

        // Final checkout button (full-width on mobile, 520px on desktop)
        checkout:
          'h-13 w-full rounded-xl px-8 text-base md:h-14 md:w-[520px] md:text-lg',

        // Form buttons (Login, Submit review, etc. Full-width on mobile, ~160px on desktop)
        form: 'h-11 w-full rounded-lg px-5 text-sm md:h-12 md:w-40 md:text-base',

        // Secondary quick actions (Buy in 1-click, Apply coupon)
        action: 'h-10 w-full rounded-lg px-4 md:w-32',

        // Content-fit: size adapts strictly to the content (auto width and height)
        content: 'h-auto w-auto rounded-lg px-5 py-3 text-sm md:text-base',

        // --- UI utility elements ---

        // Full width (for custom grids or product cards)
        full: 'w-full p-4',

        // Spaced out layout (width 100%, content pushed to edges)
        spaced: 'h-12 w-full justify-between px-5',

        // Square icon button (carousel arrows, wishlist, compare)
        icon: 'h-5 w-5 shrink-0 rounded-xl p-0',

        // Carousel pagination dot (bullet)
        // dot: 'bg-btn-dot-inactive-primary hover:bg-btn-dot-hover aria-current:bg-btn-dot-active-primary data-[active=true]:bg-btn-dot-active-primary h-3 w-3 shrink-0 rounded-full p-0 transition-colors duration-200',

        // dotSecondary:
        //   'bg-btn-dot-inactive-secondary hover:bg-btn-dot-hover aria-current:bg-btn-dot-active-secondary data-[active=true]:bg-btn-dot-active-secondary h-3 w-3 shrink-0 rounded-full p-0 transition-colors duration-200',
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
      size: 'base',
      btnType: 'button',
    },
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
