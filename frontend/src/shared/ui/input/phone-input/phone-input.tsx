'use client';

import PhoneInput, { type PhoneInputProps } from 'react-phone-input-2';

import { cn } from '@/shared/lib/utils';
import { ErrorMessage } from '@/shared/ui/error-message';
import { getInputClasses } from '@/shared/ui/input/input.styles';

import 'react-phone-input-2/lib/style.css';

export interface IPhoneInputFieldProps extends Omit<
  PhoneInputProps,
  'onChange' | 'inputComponent'
> {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  defaultCountry?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  hasError?: boolean;
  error?: string;
  label?: string;
  name?: string;
  id?: string;
  className?: string;
  placeholder?: string;
}
export function PhoneInputField({
  value = '',
  onChange,
  onBlur,
  defaultCountry = 'ua',
  disabled = false,
  readOnly = false,
  required = false,
  hasError = false,
  error,
  name = 'phone',
  id,
  className = '',
  placeholder = '+380 (44) 444-44-44',
  ...restProps
}: IPhoneInputFieldProps) {
  const isInvalid = hasError || Boolean(error);
  const inputId = id || name;
  return (
    <>
      <PhoneInput
        country={defaultCountry}
        value={value}
        onChange={(val: string) => onChange?.(val)}
        onBlur={onBlur}
        disabled={disabled}
        specialLabel=""
        autoFormat
        disableDropdown
        containerClass="relative !w-full flex items-center"
        buttonClass={cn(
          '!absolute !top-1/2 !left-3.5 !-translate-y-1/2 !p-0 !m-0 !bg-transparent !border-none pointer-events-none z-10',
          '[&>.selected-flag]:!bg-transparent [&>.selected-flag]:!p-0 [&>.selected-flag]:!m-0 [&>.selected-flag_.arrow]:!hidden',
        )}
        dropdownClass="!hidden"
        inputProps={{
          id: inputId,
          name,
          required,
          readOnly,
          placeholder,
          'aria-invalid': isInvalid,
          className: cn(
            getInputClasses(isInvalid, className),
            '!h-auto !pl-11',
          ),
        }}
        {...restProps}
      />
      <div className="min-h-4">
        <ErrorMessage error={error} />
      </div>
    </>
  );
}
