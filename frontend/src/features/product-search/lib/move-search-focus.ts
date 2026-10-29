import { type KeyboardEvent } from 'react';

/**
 * ArrowDown/ArrowUp move focus between the search input and the result links
 * inside `event.currentTarget` (elements marked `data-search-nav`, in DOM
 * order); Enter then follows the focused link natively.
 */
export function moveSearchFocus(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
    return;
  }

  const items = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>('[data-search-nav]'),
  );
  const current = items.findIndex(item => item === document.activeElement);
  const step = event.key === 'ArrowDown' ? 1 : -1;
  const next = items[Math.min(Math.max(current + step, 0), items.length - 1)];

  if (next && next !== document.activeElement) {
    // Keeps the caret and the page still while focus moves
    event.preventDefault();
    next.focus();
  }
}
