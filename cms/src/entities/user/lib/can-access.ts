import { type CmsRole } from '../model/types';

/** Admins pass every check; other roles only where listed. */
export function canAccess(role: CmsRole, allowed: readonly CmsRole[]) {
  return role === 'admin' || allowed.includes(role);
}
