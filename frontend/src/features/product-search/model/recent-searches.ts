'use client';

import { useSyncExternalStore } from 'react';

import { normalizeSearchText } from '@/shared/lib/utils';

/** Queries kept, newest first. */
const MAX_RECENT_SEARCHES = 6;

/** Longest query worth remembering; longer input is cut. */
const MAX_QUERY_LENGTH = 80;

/**
 * Where the history lives. The default is the viewer's browser; for a
 * signed-in customer swap in an adapter backed by the database (e.g. a
 * `search_history` table read/written through a Server Action) — the store
 * and the UI stay.
 */
export type RecentSearchesSource = {
  read: () => string[];
  write: (queries: readonly string[]) => void;
};

const STORAGE_KEY = 'ganka-recent-searches';

// A plain guard instead of Zod: this store loads with the header on every
// page, and Zod would add ~15 KB gzip to each of them
const isStoredHistory = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => typeof item === 'string');

/** localStorage adapter; unavailable storage (private mode) = no history. */
const localSource: RecentSearchesSource = {
  read: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : undefined;
      return isStoredHistory(parsed)
        ? parsed.slice(0, MAX_RECENT_SEARCHES)
        : [];
    } catch {
      return [];
    }
  },
  write: queries => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queries));
    } catch {
      // Non-critical: history is a convenience
    }
  },
};

const EMPTY: readonly string[] = [];

let source = localSource;
let snapshot: readonly string[] | undefined;
const listeners = new Set<() => void>();

const getSnapshot = () => (snapshot ??= source.read());

const emit = (next: readonly string[]) => {
  snapshot = next;
  source.write(next);
  listeners.forEach(listener => listener());
};

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  // Another tab changed the history
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      snapshot = undefined;
      onChange();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
};

/** Replaces the history backend (e.g. after sign-in). */
export function setRecentSearchesSource(next: RecentSearchesSource) {
  source = next;
  snapshot = undefined;
  listeners.forEach(listener => listener());
}

const sameQuery = (a: string, b: string) =>
  normalizeSearchText(a) === normalizeSearchText(b);

/** Moves `query` to the top; duplicates differing only in case/accents merge. */
export function addRecentSearch(query: string) {
  const value = query.trim().replace(/\s+/g, ' ').slice(0, MAX_QUERY_LENGTH);
  if (!normalizeSearchText(value)) {
    return;
  }
  emit(
    [value, ...getSnapshot().filter(item => !sameQuery(item, value))].slice(
      0,
      MAX_RECENT_SEARCHES,
    ),
  );
}

export function removeRecentSearch(query: string) {
  emit(getSnapshot().filter(item => item !== query));
}

export function clearRecentSearches() {
  emit([]);
}

/** Recent queries, newest first; empty on the server and before hydration. */
export function useRecentSearches(): readonly string[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
