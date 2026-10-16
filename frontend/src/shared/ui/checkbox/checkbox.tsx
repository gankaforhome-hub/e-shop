'use client';

import { type ComponentProps } from 'react';

import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

import { Icon } from '../icon';

type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>;

/**
 * Radix checkbox: one source of truth for the checked state — controlled
 * (`checked` + `onCheckedChange`) or uncontrolled (`defaultChecked`). Renders
 * `role="checkbox"` with `aria-checked`, supports `indeterminate`, and
 * submits through a hidden input inside forms. Checked uses the brand accent.
 */
function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'border-border bg-background peer inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border',
        'duration-(--dur-fast) ease-subtle transition-colors',
        'hover:border-action-primary',
        'data-[state=checked]:border-action-primary data-[state=checked]:bg-action-primary data-[state=checked]:text-action-primary-foreground',
        'data-[state=indeterminate]:border-action-primary data-[state=indeterminate]:bg-action-primary data-[state=indeterminate]:text-action-primary-foreground',
        'focus-visible:ring-ring focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group flex items-center justify-center"
      >
        <Icon
          name="check"
          aria-hidden="true"
          className="stroke-3 size-3.5 group-data-[state=indeterminate]:hidden"
        />
        <Icon
          name="minus"
          aria-hidden="true"
          className="stroke-3 hidden size-3.5 group-data-[state=indeterminate]:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, type CheckboxProps };
