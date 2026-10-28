'use client';

import { useSyncExternalStore } from 'react';

import {
  SIDEBAR_STATE_ATTRIBUTE,
  SIDEBAR_STORAGE_KEY,
} from '@/shared/config/preferences';

export type SidebarState = 'expanded' | 'collapsed';

const readSidebarState = (): SidebarState =>
  document.documentElement.getAttribute(SIDEBAR_STATE_ATTRIBUTE) === 'collapsed'
    ? 'collapsed'
    : 'expanded';

/**
 * The state lives on `<html>` (not in React state): CSS reads it through the
 * `sidebar-collapsed:` variant, so the server-rendered shell is correct
 * before hydration.
 */
export function toggleSidebar() {
  const root = document.documentElement;
  const next: SidebarState =
    readSidebarState() === 'collapsed' ? 'expanded' : 'collapsed';

  if (next === 'collapsed') {
    root.setAttribute(SIDEBAR_STATE_ATTRIBUTE, 'collapsed');
  } else {
    root.removeAttribute(SIDEBAR_STATE_ATTRIBUTE);
  }

  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, next);
  } catch {
    // Storage unavailable (private mode): the state lasts until reload
  }
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributeFilter: [SIDEBAR_STATE_ATTRIBUTE],
  });
  return () => observer.disconnect();
}

/** For non-visual bits only (labels, tooltips, ARIA): `expanded` until hydration. */
export function useSidebarState(): SidebarState {
  return useSyncExternalStore(subscribe, readSidebarState, () => 'expanded');
}
