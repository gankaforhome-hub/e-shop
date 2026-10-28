import { cache } from 'react';

import 'server-only';

import { mockCurrentUser } from '../mock/current-user';
import { type CmsUser } from '../model/types';

/**
 * DAL read of the signed-in user, deduplicated per request. Returns the mock
 * for now; once it reads the session cookie, its callers must sit inside
 * `<Suspense>` (Next.js guide "Authentication with Cache Components").
 */
export const getCurrentUser = cache(
  async (): Promise<CmsUser> => mockCurrentUser,
);
