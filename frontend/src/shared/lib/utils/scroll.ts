/** `smooth`, or `auto` when the user prefers reduced motion. Browser only. */
export function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';
}

/**
 * Scrolls `element` to the top of the viewport only if its top is hidden
 * (above the viewport or under the fixed header, i.e. `scroll-padding-top`).
 * No-op when it is already in view, so nothing jumps at the top of the page.
 */
export function scrollToTopIfHidden(element: Element | null): void {
  if (!element) {
    return;
  }

  const headerOffset =
    Number.parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    ) || 0;

  if (element.getBoundingClientRect().top < headerOffset) {
    element.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });
  }
}

/**
 * Scrolls the window to the very top (breadcrumbs and the expanded header in
 * view). No-op when already there.
 */
export function scrollToPageTop(): void {
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: getScrollBehavior() });
  }
}
