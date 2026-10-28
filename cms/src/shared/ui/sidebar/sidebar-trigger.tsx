'use client';

import { cn } from '@/shared/lib/utils';

import { Button } from '../button';
import { Icon } from '../icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';
import { SIDEBAR_ID } from './sidebar';
import { toggleSidebar, useSidebarState } from './sidebar-state';

export interface SidebarToggleLabels {
  collapse: string;
  expand: string;
}

function useToggleLabel(labels: SidebarToggleLabels) {
  const collapsed = useSidebarState() === 'collapsed';
  return { collapsed, label: collapsed ? labels.expand : labels.collapse };
}

/** Header button that collapses the desktop sidebar to its icon rail and back. */
export function SidebarTrigger({
  labels,
  className,
}: {
  labels: SidebarToggleLabels;
  className?: string;
}) {
  const { collapsed, label } = useToggleLabel(labels);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          aria-expanded={!collapsed}
          aria-controls={SIDEBAR_ID}
          onClick={toggleSidebar}
          className={className}
        >
          {/* Icon follows <html> state via CSS: correct before hydration */}
          <Icon
            name="sidebar-collapse"
            className="size-[1.125rem] in-data-[sidebar-state=collapsed]:hidden"
          />
          <Icon
            name="sidebar-expand"
            className="hidden size-[1.125rem] in-data-[sidebar-state=collapsed]:block"
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

/** Thin hit area on the sidebar's edge: click to toggle (mouse shortcut; keyboard uses the trigger). */
export function SidebarRail({ labels }: { labels: SidebarToggleLabels }) {
  const { label } = useToggleLabel(labels);

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      title={label}
      onClick={toggleSidebar}
      className={cn(
        'absolute inset-y-0 -right-2 z-20 flex w-4 cursor-w-resize transition-colors duration-(--dur-fast)',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:transition-colors',
        'hover:after:bg-sidebar-ring/40 in-data-[sidebar-state=collapsed]:cursor-e-resize',
      )}
    />
  );
}
