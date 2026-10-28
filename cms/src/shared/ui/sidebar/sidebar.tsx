import { type ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { Separator } from '../separator';

/** `id` of the desktop sidebar panel (`aria-controls` of the toggles). */
export const SIDEBAR_ID = 'cms-sidebar';

/** Page frame: desktop sidebar + inset content side by side. */
function SidebarLayout({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-wrapper"
      className={cn('flex min-h-svh w-full', className)}
      {...props}
    />
  );
}

/**
 * Desktop sidebar (`md+`), collapsible to an icon rail through
 * `<html data-sidebar-state="collapsed">` (`sidebar-collapsed:` variant).
 * Below `md` it is hidden: render the same navigation inside a `Sheet`.
 */
function Sidebar({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar"
      className="hidden text-sidebar-foreground md:block"
    >
      {/* Reserves the sidebar width in the page flow */}
      <div
        data-slot="sidebar-gap"
        className="relative w-(--sidebar-width) transition-[width] duration-(--dur-normal) ease-subtle sidebar-collapsed:w-(--sidebar-width-icon)"
      />
      <div
        id={SIDEBAR_ID}
        data-slot="sidebar-container"
        className={cn(
          'fixed inset-y-0 left-0 z-20 flex h-svh w-(--sidebar-width) border-r border-sidebar-border bg-sidebar transition-[width] duration-(--dur-normal) ease-subtle sidebar-collapsed:w-(--sidebar-width-icon)',
          className,
        )}
        {...props}
      >
        <div data-slot="sidebar-inner" className="flex size-full flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Main column next to the sidebar; `min-w-0` lets wide tables scroll inside it. */
function SidebarInset({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-inset"
      className={cn(
        'relative flex min-w-0 flex-1 flex-col bg-background',
        className,
      )}
      {...props}
    />
  );
}

/** Same height as the app header, so their bottom borders line up. */
function SidebarHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        'flex h-(--header-height) shrink-0 items-center border-b border-sidebar-border px-2',
        className,
      )}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        'flex shrink-0 flex-col gap-1 border-t border-sidebar-border p-2',
        className,
      )}
      {...props}
    />
  );
}

/** Scroll area; on the icon rail the scrollbar is hidden to keep icons centred. */
function SidebarContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        'flex min-h-0 flex-1 scrollbar-thin flex-col overflow-x-hidden overflow-y-auto overscroll-contain sidebar-collapsed:scrollbar-none',
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  );
}

/** Block title; folds away on the icon rail, where separators keep blocks apart. */
function SidebarGroupLabel({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        'flex h-8 shrink-0 items-center overflow-hidden px-2 text-xs font-semibold tracking-[0.08em] whitespace-nowrap text-sidebar-label uppercase transition-[height,opacity] duration-(--dur-normal) ease-subtle select-none sidebar-collapsed:h-0 sidebar-collapsed:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn('relative', className)}
      {...props}
    />
  );
}

function SidebarSeparator({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      className={cn('mx-2 w-auto bg-sidebar-border', className)}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarLayout,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
};
