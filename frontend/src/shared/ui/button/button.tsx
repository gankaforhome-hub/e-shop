import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ButtonHTMLAttributes, type FC } from 'react';

import { cn } from '@/shared/lib/utils';
/** @type {*} */
const buttonVariants = cva(
  // Базові стилі: сучасний інтерактивний елемент
  'focus-visible:ring-ring text-primary custom-transition inline-flex select-none items-center justify-center whitespace-nowrap text-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-90',
  {
    variants: {
      variant: {
        // Default solid button
        default:
          'bg-action-primary text-text-inverse hover:bg-action-primary-hover focus:bg-action-primary-hover disabled:bg-brand-soft disabled:text-text-inverse/70 shadow-sm',
        // Outline button
        outline:
          'border-action-primary bg-action-secondary text-text-secondary hover:bg-brand-soft/25 hover:border-action-primary-hover focus:border-action-primary-hover disabled:bg-brand-soft/70 disabled:text-text-inverse/70 border-2 border-solid',
        // Link button (for navigation/routing)
        link: 'text-text-primary bg-action-secondary inline h-auto w-auto p-0 underline-offset-4 hover:underline focus-visible:underline',
        // Icon button (for carousels, UI actions)
        icon: 'text-action-secondary-text hover:text-action-primary-hover border-0 border-transparent bg-transparent p-0 focus:bg-transparent active:bg-transparent',

        ghost:
          'text-action-secondary-text border-white/30 bg-white/10 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:scale-105 hover:border-white/50 hover:bg-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.24)] focus:border-white/50 focus:bg-white/20 focus:shadow-[0_12px_40px_rgba(0,0,0,0.24)] active:scale-95',

        dot: 'bg-(--dot-inactive-primary) hover:bg-(--dot-hover) aria-current:bg-(--dot-active-primary) data-[active=true]:bg-(--dot-active-primary) shrink-0 transition-colors duration-200',

        dotSecondary:
          'bg-(--dot-inactive-secondary) hover:bg-(--dot-hover) aria-current:bg-(--dot-active-secondary) data-[active=true]:bg-(--dot-active-secondary) shrink-0 p-0 transition-colors duration-200',
      },
      size: {
        base: 'w-75 rounded-xl p-4',
        // --- Semantic adaptive sizes for e-commerce ---

        // "Buy" button (full-width on mobile, 300px on desktop)
        buy: 'md:h-13 md:w-75 t h-12 w-full rounded-xl px-6',

        // Final checkout button (full-width on mobile, 520px on desktop)
        checkout:
          'h-13 md:w-130 w-full rounded-xl px-8 text-base md:h-14 md:text-lg',

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
        icon: 'h-5 w-5 shrink-0',

        dots: 'h-3 w-3 rounded-full md:h-5 md:w-5',
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
