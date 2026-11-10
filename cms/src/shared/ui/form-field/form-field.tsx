import { type ReactElement, type ReactNode, cloneElement } from 'react';

import { Label } from '../label';
import { Text } from '../text';

interface FormFieldProps {
  id: string;
  label: ReactNode;
  /** Translated error text. */
  error?: string;
  hint?: ReactNode;
  /** The control (Input, Textarea, Select): receives `id` and the ARIA links. */
  children: ReactElement<{
    id?: string;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
  }>;
}

/** Label, control, hint and error of one form field, linked for screen readers. */
export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: FormFieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {cloneElement(children, {
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
      })}
      {hint ? (
        <Text id={hintId} size="xs" variant="muted">
          {hint}
        </Text>
      ) : null}
      {error ? (
        <Text id={errorId} size="xs" variant="destructive">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
