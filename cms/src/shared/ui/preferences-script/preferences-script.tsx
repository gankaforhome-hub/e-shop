'use client';

import { useLayoutEffect, useSyncExternalStore } from 'react';

import {
  SIDEBAR_STATE_ATTRIBUTE,
  SIDEBAR_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from '@/shared/config/preferences';

import { applyPreferences } from './apply-preferences';

const ARGS = [
  THEME_STORAGE_KEY,
  SIDEBAR_STORAGE_KEY,
  SIDEBAR_STATE_ATTRIBUTE,
] as const;

const script = `(${applyPreferences.toString()})(...${JSON.stringify(ARGS)})`;

const subscribe = () => () => {};

/**
 * First child of `<body>` in the root layout (`<html>` needs
 * `suppressHydrationWarning`). On document loads the inline script applies
 * the stored theme and sidebar state before first paint. When React renders
 * the root layout on the client instead (Next's not-found shell), scripts
 * never execute: the layout effect applies them before paint, and the
 * `<script>` is left out so React doesn't warn about it.
 */
export function PreferencesScript() {
  // `true` on the server and while hydrating, `false` for client-only renders
  const isServerOrHydrating = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );

  useLayoutEffect(() => {
    applyPreferences(...ARGS);
  }, []);

  if (!isServerOrHydrating) {
    return null;
  }

  return (
    <script
      // Server and client bundles may serialize the function differently
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
