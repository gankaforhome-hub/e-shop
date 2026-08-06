import { type AppRoutes } from '@/shared/config';

function normalizePath(path: string): string {
  // Видаляє дволітерні коди мов з початку шляху (/uk, /en тощо)
  const normalized = path.replace(/^\/[a-z]{2}(?=\/|$)/, '');
  return normalized === '' ? '/' : normalized;
}

export function isActiveRoute(
  currentPath: string,
  targetHref: AppRoutes,
): boolean {
  const cleanCurrentPath = normalizePath(currentPath);
  const [targetPath = ''] = targetHref.split('?');

  if (targetPath === '/') {
    return cleanCurrentPath === '/';
  }

  return (
    cleanCurrentPath === targetPath ||
    cleanCurrentPath.startsWith(`${targetPath}/`)
  );
}
