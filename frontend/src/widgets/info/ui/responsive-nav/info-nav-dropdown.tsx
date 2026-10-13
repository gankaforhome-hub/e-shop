'use client';

import { type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';

interface InfoNavDropdownProps {
  className?: string;
  children: ReactNode;
}

/**
 * `<details>` disclosure that closes as soon as a link inside it is selected
 * (before the route transition finishes) and on Escape, returning focus to
 * the trigger. Children (summary + links) stay server-rendered.
 */
export function InfoNavDropdown({ className, children }: InfoNavDropdownProps) {
  const handleClick = (event: MouseEvent<HTMLDetailsElement>) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      event.currentTarget.open = false;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDetailsElement>) => {
    const details = event.currentTarget;
    if (event.key !== 'Escape' || !details.open) {
      return;
    }
    details.open = false;
    details.querySelector('summary')?.focus();
  };

  return (
    <details
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </details>
  );
}
