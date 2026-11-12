import { cache } from 'react';

import { cookies } from 'next/headers';

import 'server-only';

import { getLocale } from 'next-intl/server';

import { getProfileRequest } from '@/shared/api/auth-api';
import { routes } from '@/shared/config';
import { redirect } from '@/shared/i18n/navigation';
import { ACCESS_TOKEN_COOKIE } from '@/shared/lib/session/session-cookies';

import { mapStaffRole } from '../lib/map-staff-role';
import { type CmsUser, type KeyStep } from '../model/types';

/**
 * DAL read of the signed-in user, deduplicated per request. The API verifies the token,
 * so a forged or revoked cookie that got past `proxy.ts` ends up on the sign-in page.
 * It reads cookies, so its callers need `<Suspense>` or a blocking route (`instant = false`).
 */
export const getCurrentUser = cache(async (): Promise<CmsUser> => {
  const store = await cookies();
  const accessToken = store.get(ACCESS_TOKEN_COOKIE)?.value;
  const result = accessToken ? await getProfileRequest(accessToken) : null;

  if (!result?.ok) {
    return redirect({ href: routes.auth.login, locale: await getLocale() });
  }

  const { id, email, name, role, hasKey, keyConfirmed, approved, isRoot } =
    result.data;
  let keyStep: KeyStep | null = null;
  if (!hasKey) {
    keyStep = 'add';
  } else if (!keyConfirmed) {
    keyStep = 'confirm';
  } else if (!approved) {
    keyStep = 'approval';
  }

  return {
    id,
    email,
    name: name ?? email,
    role: mapStaffRole(role),
    keyStep,
    enrollmentCodeRequired: role === 'ROOT',
    isRoot,
  };
});
