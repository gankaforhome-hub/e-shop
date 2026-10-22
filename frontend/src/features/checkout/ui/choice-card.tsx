'use client';

import { type ReactNode, useId } from 'react';

import { RadioGroupItem } from '@/shared/ui/radio-group';
import { Text } from '@/shared/ui/text';

interface ChoiceCardProps {
  value: string;
  title: string;
  description?: string;
  /** Trailing visual, e.g. payment brand icons. */
  aside?: ReactNode;
}

/** Selectable option card (delivery / payment); must sit inside a `RadioGroup`. */
export function ChoiceCard({
  value,
  title,
  description,
  aside,
}: ChoiceCardProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className="border-border hover:border-foreground/40 has-data-[state=checked]:border-action-primary has-data-[state=checked]:bg-muted/60 duration-(--dur-fast) ease-subtle flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors"
    >
      <RadioGroupItem id={id} value={value} className="mt-0.5" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <Text
          as="span"
          size="none"
          className="text-sm leading-snug md:text-base"
        >
          {title}
        </Text>
        {description && (
          <Text
            as="span"
            size="none"
            variant="muted"
            className="text-xs md:text-sm"
          >
            {description}
          </Text>
        )}
      </span>
      {aside}
    </label>
  );
}
