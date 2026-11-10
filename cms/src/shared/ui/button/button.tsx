import { type ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-(--dur-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover',
        /** Irreversible actions (delete), mostly inside a confirmation dialog. */
        destructive:
          'bg-destructive text-primary-foreground shadow-xs hover:bg-destructive/90',
        /** Quiet entry to a destructive action (opens its confirmation). */
        ghostDestructive:
          'text-destructive hover:bg-destructive/10 data-[state=open]:bg-destructive/10',
        /** Secondary inline action in the brand accent (e.g. "Create a season"). */
        link: 'text-brand underline-offset-4 hover:underline',
        ghost:
          'hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-4',
        icon: 'size-9',
        /** No box: sits in a line of text or under a field. */
        inline: 'h-auto px-0 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      // A plain button never submits a form by accident
      type={asChild ? type : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
