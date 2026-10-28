/**
 * Per-browser UI preferences: persisted in localStorage and applied to
 * `<html>` before first paint by `PreferencesScript`, so the static shell
 * renders without a flash of the wrong theme or sidebar width.
 */
export const THEME_STORAGE_KEY = 'cms-theme';
export const SIDEBAR_STORAGE_KEY = 'cms-sidebar';

/** `<html data-sidebar-state="collapsed">` drives the `sidebar-collapsed:` variant (global.css). */
export const SIDEBAR_STATE_ATTRIBUTE = 'data-sidebar-state';
