import { type AppRoutes } from '@/shared/config';

/**
 * `pathname` comes from the i18n `usePathname` (no locale prefix). Sections
 * stay active on their sub-pages (`/catalog/products/42` → Products); the
 * overview home (`/`) only on an exact match.
 */
export function isActiveRoute(pathname: string, href: AppRoutes): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
