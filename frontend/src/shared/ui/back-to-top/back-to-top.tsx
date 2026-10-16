'use client';

import { useSyncExternalStore } from 'react';

import { cn, getScrollBehavior } from '@/shared/lib/utils';
import { Icon } from '@/shared/ui/icon';

export interface BackToTopProps {
  /** Accessible name ("Back to top"); also shown as the tooltip. */
  label: string;
  /** Element to return to (`id`); falls back to the top of the page. */
  targetId?: string;
  /** Scroll distance (px) after which the button appears. */
  threshold?: number;
  className?: string;
}

/**
 * Passive, rAF-throttled scroll subscription. React only re-renders when the
 * snapshot (past the threshold or not) flips, not on every scroll event.
 */
function subscribeToScroll(onChange: () => void) {
  let frame = 0;
  const handleScroll = () => {
    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        onChange();
      });
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', handleScroll);
    cancelAnimationFrame(frame);
  };
}

/**
 * Floating round button, bottom-right. Fades in past `threshold` and scrolls
 * back to `targetId` (respecting the header's `scroll-padding-top` and reduced
 * motion) without touching the URL. When hidden it is `invisible`, so it is out
 * of the tab order and the accessibility tree.
 */
export function BackToTop({
  label,
  targetId,
  threshold = 400,
  className,
}: BackToTopProps) {
  const isVisible = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY >= threshold,
    () => false,
  );

  const handleClick = () => {
    const behavior = getScrollBehavior();
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      target.scrollIntoView({ behavior, block: 'start' });
      // Keep keyboard users in context instead of losing focus to <body>
      target.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-visible={isVisible}
      onClick={handleClick}
      className={cn(
        'fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 md:bottom-6 md:right-6',
        'bg-background/90 text-foreground border-border flex size-11 cursor-pointer items-center justify-center rounded-full border shadow-lg backdrop-blur-sm',
        'hover:bg-action-primary hover:text-action-primary-foreground hover:border-action-primary',
        'focus-visible:ring-ring outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'duration-(--dur-normal) ease-subtle transition-[opacity,translate,visibility,background-color,color,border-color]',
        'invisible translate-y-3 opacity-0 data-[visible=true]:visible data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100',
        'motion-reduce:translate-y-0',
        className,
      )}
    >
      <Icon name="arrow-up" aria-hidden="true" className="size-5" />
    </button>
  );
}
