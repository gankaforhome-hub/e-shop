/**
 * Applies the stored theme (or the OS scheme) and sidebar state to `<html>`.
 * Self-contained — no imports or outer variables — because it is also
 * serialized into the inline script with `Function.prototype.toString()`.
 */
export function applyPreferences(
  themeKey: string,
  sidebarKey: string,
  sidebarAttribute: string,
) {
  try {
    const root = document.documentElement;
    const theme = localStorage.getItem(themeKey);
    const dark = theme
      ? theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

    root.classList.toggle('dark', dark);
    if (localStorage.getItem(sidebarKey) === 'collapsed') {
      root.setAttribute(sidebarAttribute, 'collapsed');
    }
  } catch {
    // Storage blocked: keep the defaults (light theme, expanded sidebar)
  }
}
