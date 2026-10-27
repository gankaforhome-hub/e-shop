import { type ButtonHTMLAttributes, type Ref } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

export const buttonVariants = cva(
  'font-caption focus-visible:ring-ring duration-(--dur-normal) inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-action-primary text-action-primary-foreground hover:bg-action-primary-hover active:bg-action-primary-active disabled:bg-action-primary/40 disabled:text-action-primary-foreground/40 shadow-sm hover:shadow-md',
        outline:
          'border-action-primary bg-action-secondary text-action-secondary-foreground hover:border-action-secondary-hover active:border-action-secondary-active hover:bg-action-secondary-hover/2 disabled:border-action-primary/40 disabled:text-action-secondary-foreground/20 border',
        ghost:
          'font-normal focus-visible:ring-0 focus-visible:ring-offset-0 active:scale-100',
        /** Inline text action in the brand accent (e.g. "Clear all"). */
        link: 'text-action-primary hover:text-action-primary-hover underline-offset-4 hover:underline active:scale-100',
        iconPrimary:
          'text-icon hover:text-icon-hover bg-white/20 shadow-lg hover:scale-105 hover:bg-white/30 active:scale-95 disabled:opacity-20',
        iconSecondary:
          'text-action-secondary-foreground border-muted/30 bg-muted/10 hover:border-muted/50 hover:bg-muted/20 group border shadow-sm backdrop-blur-md transition-all duration-200 active:scale-95 disabled:opacity-20',
        dot: 'bg-dot-inactive-primary hover:bg-dot-hover aria-current:bg-dot-active-primary data-[active=true]:bg-dot-active-primary shrink-0 transition-colors duration-200',
        dotSecondary:
          'bg-dot-inactive-secondary hover:bg-dot-hover aria-current:bg-dot-active-secondary data-[active=true]:bg-dot-active-secondary shrink-0 p-0 transition-colors duration-200',
      },
      size: {
        small: 'px-4 py-2 text-xs',
        medium: 'min-w-37.5 px-6 py-3 text-sm',
        large: 'min-w-75 px-8 py-4 text-base font-semibold',
        full: 'w-full',
        icon: 'flex h-8 w-8 items-center justify-center rounded-none p-1',
        /** Square icon button beside the PDP CTA (`h-14 md:h-16 xl:h-18`). */
        iconBlock: 'xl:size-18 size-14 shrink-0 p-0 md:size-16',
        dots: 'h-3 w-3 rounded-full p-0', // WCAG 44px min target
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ref,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
