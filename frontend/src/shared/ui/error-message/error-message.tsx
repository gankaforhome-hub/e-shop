import { cn } from '@/shared/lib/utils';

interface IErrorMessageProps {
  error: string | string[] | undefined;
  className?: string;
}

export function ErrorMessage({ error, className }: IErrorMessageProps) {
  const message = Array.isArray(error) ? error[0] : error;

  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        'text-status-error-fg font-caption ml-1 text-xs',
        className,
      )}
    >
      {message}
    </p>
  );
}
