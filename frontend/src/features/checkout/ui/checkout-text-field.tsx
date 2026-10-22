'use client';

import { type ComponentProps } from 'react';

import { useFormContext } from 'react-hook-form';

import { cn } from '@/shared/lib/utils';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import {
  type CheckoutFieldName,
  type CheckoutFormValues,
} from '../model/checkout.schema';

type TextFieldName = Exclude<CheckoutFieldName, 'billingSameAsShipping'>;

interface CheckoutTextFieldProps extends Omit<
  ComponentProps<'input'>,
  'name' | 'id' | 'className'
> {
  name: TextFieldName;
  label: string;
  required?: boolean;
  /** Layout only (grid placement). */
  className?: string;
  /** Runs after RHF's own change handler (e.g. reset a dependent field). */
  onValueChange?: () => void;
}

export const checkoutFieldId = (name: CheckoutFieldName) => `checkout-${name}`;

/** Label + input + inline error, bound to the surrounding checkout form. */
export function CheckoutTextField({
  name,
  label,
  required,
  className,
  onValueChange,
  ...inputProps
}: CheckoutTextFieldProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<CheckoutFormValues>();
  const id = checkoutFieldId(name);

  return (
    <div className={cn('flex min-w-0 flex-col', className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input
        id={id}
        aria-required={required}
        disabled={isSubmitting}
        error={errors[name]?.message}
        {...inputProps}
        {...register(name, { onChange: onValueChange })}
      />
    </div>
  );
}
