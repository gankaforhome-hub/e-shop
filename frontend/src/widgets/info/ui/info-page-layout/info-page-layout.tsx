import { type ReactNode } from 'react';

import { InfoContentSkeleton } from '../info-content/info-content';
import { ResponsiveNavSkeleton } from '../responsive-nav/responsive-nav-skeleton';

interface InfoPageLayoutProps {
  nav: ReactNode;
  children: ReactNode;
}

/**
 * Sidebar + text column centered as one block. Fixed tracks keep the sidebar
 * in place between pages; below `lg` it stacks with the dropdown on top.
 * Each info route remounts this tree, so only the text column fades in on
 * navigation while the sidebar stays still; `data-smooth-scroll` makes the
 * scroll-to-top glide (both disabled under `prefers-reduced-motion`).
 */
export function InfoPageLayout({ nav, children }: InfoPageLayoutProps) {
  return (
    <div
      data-smooth-scroll
      className="grid grid-cols-1 gap-8 md:gap-10 lg:mx-auto lg:max-w-7xl lg:grid-cols-[16rem_minmax(0,var(--container-3xl))] lg:justify-center lg:gap-16 lg:px-4 xl:grid-cols-[18rem_minmax(0,var(--container-3xl))] xl:gap-20 xl:px-6"
    >
      <aside className="duration-(--dur-slow) ease-subtle lg:sticky lg:top-[calc(var(--h-header-desktop-current)+1.5rem)] lg:self-start lg:transition-[top]">
        {nav}
      </aside>
      <div className="motion-safe:animate-page-enter min-w-0 max-w-3xl">
        {children}
      </div>
    </div>
  );
}

export function InfoPageLayoutSkeleton() {
  return (
    <InfoPageLayout nav={<ResponsiveNavSkeleton />}>
      <InfoContentSkeleton />
    </InfoPageLayout>
  );
}
