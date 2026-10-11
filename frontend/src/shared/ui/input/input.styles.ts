import { cn } from '@/shared/lib/utils';

export const inputBaseClasses = cn(
  'border-input bg-background text-foreground font-caption w-full rounded-md border px-4 py-4 text-sm lg:text-base',
  'placeholder:text-muted-foreground duration-(--dur-fast) outline-none transition-colors',
  'focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60',
);

export const getInputClasses = (hasError?: boolean, className?: string) => {
  return cn(
    inputBaseClasses,
    hasError && 'border-accent-border focus:border-accent-border',
    className,
  );
};
