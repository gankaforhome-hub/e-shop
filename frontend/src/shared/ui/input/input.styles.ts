import { cn } from '@/shared/lib/utils';

export const inputBaseClasses = cn(
  'border-input bg-background text-foreground font-caption w-full rounded-md border px-4 py-4 text-sm lg:text-base outline-none transition',
  'focus:border-neutral-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  'transition-colors duration-[--duration] placeholder:text-slate-400',
  'disabled:cursor-not-allowed disabled:opacity-60',
  'w-full',
);

export const getInputClasses = (hasError?: boolean, className?: string) => {
  return cn(
    inputBaseClasses,
    hasError && 'border-accent-border focus:border-accent-border',
    className,
  );
};
