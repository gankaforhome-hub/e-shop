'use client';

import { type ComponentProps } from 'react';

import { Slider as SliderPrimitive } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

interface SliderProps extends ComponentProps<typeof SliderPrimitive.Root> {
  /** Accessible name per thumb (e.g. "Min price", "Max price"). */
  thumbLabels?: readonly string[];
}

/**
 * Horizontal range slider (Radix): one thumb per value, so `[min, max]` gives
 * a dual range. Neutral hairline track, brand range, soft focus ring.
 */
export function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  thumbLabels = [],
  ...props
}: SliderProps) {
  const thumbs = value ?? defaultValue ?? [min];

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      className={cn(
        'relative flex h-5 w-full touch-none select-none items-center data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="bg-border relative h-0.5 grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-foreground absolute h-full" />
      </SliderPrimitive.Track>
      {thumbs.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          aria-label={thumbLabels[index]}
          className="border-foreground bg-background ring-ring/30 duration-(--dur-fast) block size-4 cursor-grab rounded-full border shadow-sm outline-none transition-[box-shadow] hover:ring-4 focus-visible:ring-4 active:cursor-grabbing"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
