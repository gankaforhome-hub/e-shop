'use client';

import { type ComponentProps } from 'react';

import { Accordion as AccordionPrimitive } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

import { Icon } from '../icon';

function Accordion({
  ...props
}: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        'data-[state=open]:bg-muted/50 duration-(--dur-slow) group rounded-none border-none p-5 transition-colors sm:p-7 md:p-8',
        className,
      )}
      {...props}
    />
  );
}

interface AccordionTriggerProps extends ComponentProps<
  typeof AccordionPrimitive.Trigger
> {
  /** Expand indicator: `plusMinus` (default) or a chevron rotating 180° when open. */
  indicator?: 'plusMinus' | 'chevron';
  /** Title scale: `default` 16 → 18px, `compact` 14 → 16px (long-form pages). */
  size?: 'default' | 'compact';
}

function AccordionTrigger({
  className,
  children,
  indicator = 'plusMinus',
  size = 'default',
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'font-caption focus-visible:border-ring focus-visible:ring-ring/50 text-foreground flex flex-1 cursor-pointer items-center justify-between gap-4 text-left font-semibold outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
          size === 'compact' ? 'text-sm md:text-base' : 'text-base md:text-lg',
          className,
        )}
        {...props}
      >
        <span>{children}</span>

        {/* Icons toggle via the parent AccordionItem's data-state */}
        <span className="shrink-0 text-inherit" aria-hidden="true">
          {indicator === 'chevron' ? (
            <Icon
              name="chevron-down"
              className={cn(
                'duration-(--dur-normal) ease-subtle transition-transform group-data-[state=open]:rotate-180',
                size === 'compact' ? 'size-4' : 'size-5',
              )}
            />
          ) : (
            <>
              <Icon
                name="plus"
                className="duration-(--dur-slow) size-4 transition-transform group-data-[state=open]:hidden"
              />
              <Icon
                name="minus"
                className="duration-(--dur-slow) hidden size-4 transition-transform group-data-[state=open]:block"
              />
            </>
          )}
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="font-caption data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down text-foreground overflow-hidden text-sm md:text-base"
      {...props}
    >
      <div className={cn('max-w-2xl pt-3 leading-relaxed md:pt-4', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
