'use client';

import { useSyncExternalStore } from 'react';

import { THEME_STORAGE_KEY } from '@/shared/config/preferences';

export const THEMES = ['light', 'dark'] as const;

export type Theme = (typeof THEMES)[number];

const isTheme = (value: unknown): value is Theme =>
  value === 'light' || value === 'dark';

const readTheme = (): Theme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** Swaps the theme class without animating every `transition-colors` element. */
function applyTheme(theme: Theme) {
  const freeze = document.createElement('style');
  freeze.textContent = '*,*::before,*::after{transition:none!important}';
  document.head.append(freeze);
  document.documentElement.classList.toggle('dark', theme === 'dark');
  // Reading a computed value flushes styles while transitions are disabled
  void window.getComputedStyle(document.body).color;
  freeze.remove();
}

export function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (private mode): the choice lasts until reload
  }
}

export function toggleTheme() {
  setTheme(readTheme() === 'dark' ? 'light' : 'dark');
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ['class'] });

  // Follow other tabs, and the OS scheme until the user picks a theme
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY && isTheme(event.newValue)) {
      applyTheme(event.newValue);
    }
  };
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const onSchemeChange = () => {
    if (!readStoredTheme()) {
      applyTheme(scheme.matches ? 'dark' : 'light');
    }
  };

  window.addEventListener('storage', onStorage);
  scheme.addEventListener('change', onSchemeChange);

  return () => {
    observer.disconnect();
    window.removeEventListener('storage', onStorage);
    scheme.removeEventListener('change', onSchemeChange);
  };
}

/**
 * Current theme, or `null` on the server and during hydration: the class is
 * set before paint by `PreferencesScript`, so render theme-specific visuals
 * with `dark:` utilities and use this value for labels and pressed states.
 */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, readTheme, () => null);
}
