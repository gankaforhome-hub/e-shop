import { type ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

import { Icon } from '../icon';

/**
 * Page-level breadcrumb rhythm (catalog reference): inner padding only, so
 * trails line up identically on every page. Reuse it in skeletons.
 */
const breadcrumbVariants = cva('', {
  variants: {
    spacing: {
      default: 'pb-3 pt-2 md:pb-4 md:pt-4',
      none: '',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

function Breadcrumb({
  className,
  spacing,
  ...props
}: ComponentProps<'nav'> & VariantProps<typeof breadcrumbVariants>) {
  return (
    <nav
      data-slot="breadcrumb"
      className={cn(breadcrumbVariants({ spacing }), className)}
      {...props}
    />
  );
}

function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'wrap-break-word flex flex-wrap items-center gap-1.5 text-sm md:gap-2.5 md:text-base',
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: ComponentProps<'a'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'a';

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn('hover:text-foreground/70', className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-caption', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('', className)}
      {...props}
    >
      {children ?? (
        <Icon name="breadcrumb-separator" className="-rotate-15 size-2.5" />
      )}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-8 items-center justify-center', className)}
      {...props}
    >
      <Icon name="ellipsis" className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  breadcrumbVariants,
};
