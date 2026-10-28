'use client';

import { useState, type ComponentProps, type ReactElement } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';
import { useSidebarState } from './sidebar-state';

const sidebarMenuButtonVariants = cva(
  'flex w-full items-center gap-2.5 overflow-hidden rounded-md p-2 text-left text-sidebar-foreground ring-sidebar-ring transition-[width,height,padding,color,background-color,box-shadow] duration-(--dur-fast) outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-active data-[active=true]:font-medium data-[active=true]:text-sidebar-active-foreground data-[active=true]:shadow-sm sidebar-collapsed:size-8! sidebar-collapsed:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 data-[active=true]:[&>svg]:text-sidebar-primary',
  {
    variants: {
      size: {
        /** Desktop rows: 32px, the icon rail's button size. */
        default: 'h-8 text-sm',
        /** Mobile sheet rows: 40px touch targets. */
        touch: 'h-10 text-[0.9375rem]',
        /** Brand row in the sidebar header: a 32px tile + two text lines. */
        brand: 'h-10 p-1 sidebar-collapsed:p-0!',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export interface SidebarMenuButtonProps
  extends
    ComponentProps<'button'>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
  isActive?: boolean;
  /** Label shown on hover/focus while the sidebar is collapsed to icons. */
  tooltip?: string;
}

export function SidebarMenuButton({
  asChild = false,
  isActive = false,
  size,
  tooltip,
  className,
  type,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive}
      type={asChild ? type : (type ?? 'button')}
      className={cn(sidebarMenuButtonVariants({ size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  return <CollapsedTooltip label={tooltip}>{button}</CollapsedTooltip>;
}

/**
 * Always rendered (stable tree), but kept closed while the sidebar is
 * expanded — the visible label already names the item, so screen readers get
 * no duplicate description.
 */
function CollapsedTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) {
  const collapsed = useSidebarState() === 'collapsed';
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={collapsed && open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
