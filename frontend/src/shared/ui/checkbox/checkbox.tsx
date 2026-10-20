'use client';

import { type ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

import { Icon } from '../icon';

const checkboxVariants = cva(
  [
    'bg-background peer inline-flex shrink-0 cursor-pointer items-center justify-center border',
    'duration-(--dur-fast) ease-subtle transition-colors',
    'data-[state=checked]:border-action-primary data-[state=checked]:bg-action-primary data-[state=checked]:text-action-primary-foreground',
    'data-[state=indeterminate]:border-action-primary data-[state=indeterminate]:bg-action-primary data-[state=indeterminate]:text-action-primary-foreground',
    'focus-visible:ring-ring focus-visible:ring-offset-background outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default:
          'border-border hover:border-action-primary size-5 rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2',
        /** Filter lists: 16px, hairline neutral border, 1px focus ring. */
        minimal:
          'border-foreground/25 hover:border-foreground/60 size-4 rounded-[3px] focus-visible:ring-1 focus-visible:ring-offset-1',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

const iconSize = {
  default: 'size-3.5 stroke-3',
  minimal: 'size-3 stroke-[2.5]',
} as const;

type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>;

/**
 * Radix checkbox: one source of truth for the checked state — controlled
 * (`checked` + `onCheckedChange`) or uncontrolled (`defaultChecked`). Renders
 * `role="checkbox"` with `aria-checked`, supports `indeterminate`, and
 * submits through a hidden input inside forms. Checked uses the brand accent.
 */
function Checkbox({ className, variant, ...props }: CheckboxProps) {
  const icon = iconSize[variant ?? 'default'];

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ variant }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group flex items-center justify-center"
      >
        <Icon
          name="check"
          aria-hidden="true"
          className={cn(icon, 'group-data-[state=indeterminate]:hidden')}
        />
        <Icon
          name="minus"
          aria-hidden="true"
          className={cn(icon, 'hidden group-data-[state=indeterminate]:block')}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, type CheckboxProps };
