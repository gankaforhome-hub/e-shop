import { type ComponentProps } from 'react';

import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Text } from '@/shared/ui/text';

interface AuthFieldProps extends ComponentProps<typeof Input> {
  id: string;
  label: string;
  error?: string;
}

export function AuthField({ id, label, error, ...props }: AuthFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error ? (
        <Text id={errorId} size="xs" variant="destructive">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
