'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ComponentProps, FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { Icon } from '@/shared/ui/icon';

export const Accordion: FC<ComponentProps<typeof AccordionPrimitive.Root>> = ({
  ...props
}) => {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
};

export const AccordionItem: FC<
  ComponentProps<typeof AccordionPrimitive.Item>
> = ({ className, ...props }) => {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-border-muted border-b', className)}
      {...props}
    />
  );
};

export const AccordionTrigger: FC<
  ComponentProps<typeof AccordionPrimitive.Trigger>
> = ({ className, children, ...props }) => {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none transition-all hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-90',
          'relative',
          className,
        )}
        {...props}
      >
        {children}
        <Icon
          name="arrow"
          className="fill-fg pointer-events-none h-4 w-4 shrink-0 translate-y-1/2 -rotate-90 transition-transform duration-200"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

export const AccordionContent: FC<
  ComponentProps<typeof AccordionPrimitive.Content>
> = ({ className, children, ...props }) => {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('pb-4 pt-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
};
