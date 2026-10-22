'use client';

import { type ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

const radioGroupItemVariants = cva(
  [
    'peer shrink-0 cursor-pointer outline-none',
    'duration-(--dur-fast) ease-subtle transition-colors',
    'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        /** Round dot; pair it with a `<label>` (e.g. an option card). */
        default: [
          'border-border bg-background hover:border-action-primary inline-flex size-5 items-center justify-center rounded-full border',
          'data-[state=checked]:border-action-primary',
        ],
        /** Segmented-control tab; renders its children as the label. */
        segment: [
          'font-caption text-foreground inline-flex flex-1 items-center justify-center rounded-md px-3 py-2.5 text-sm md:text-base',
          'hover:text-foreground-emphasis',
          'data-[state=checked]:bg-background data-[state=checked]:text-foreground-emphasis data-[state=checked]:shadow-sm',
        ],
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

function RadioGroup({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      {...props}
    />
  );
}

/** Wraps `RadioGroup` items of the `segment` variant into a track. */
function RadioGroupSegments({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('bg-muted flex gap-1 rounded-lg p-1', className)}
      {...props}
    />
  );
}

type RadioGroupItemProps = ComponentProps<typeof RadioGroupPrimitive.Item> &
  VariantProps<typeof radioGroupItemVariants>;

/**
 * Radix radio: arrow-key navigation, `role="radio"` with `aria-checked`, and
 * a hidden input for native form submits. The checked dot uses the brand accent.
 */
function RadioGroupItem({
  className,
  variant,
  children,
  ...props
}: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(radioGroupItemVariants({ variant }), className)}
      {...props}
    >
      {variant === 'segment' ? (
        children
      ) : (
        <RadioGroupPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="bg-action-primary size-2.5 rounded-full"
        />
      )}
    </RadioGroupPrimitive.Item>
  );
}

export {
  RadioGroup,
  RadioGroupItem,
  RadioGroupSegments,
  type RadioGroupItemProps,
};
