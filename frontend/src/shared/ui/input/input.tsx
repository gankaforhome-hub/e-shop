import type { ComponentProps } from 'react';

import { ErrorMessage } from '@/shared/ui/error-message';
import { getInputClasses } from '@/shared/ui/input/input.styles';

export interface InputProps extends ComponentProps<'input'> {
  hasError?: boolean;
  error?: string;
}

export function Input({
  className,
  hasError,
  error,
  ref,
  ...props
}: InputProps) {
  const isInvalid = hasError || Boolean(error);

  return (
    <>
      <input
        ref={ref}
        aria-invalid={isInvalid}
        className={getInputClasses(isInvalid, className)}
        {...props}
      />
      <div className="min-h-4">
        <ErrorMessage error={error} />
      </div>
    </>
  );
}
