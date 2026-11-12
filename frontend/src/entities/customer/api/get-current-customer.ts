import { cache } from 'react';

import { cookies } from 'next/headers';

import 'server-only';

import { getProfileRequest } from '@/shared/api/auth-api';
import { ACCESS_TOKEN_COOKIE } from '@/shared/lib/session';

import { type Customer } from '../model/types';

/**
 * DAL read of the signed-in customer, deduplicated per request; `null` without a valid
 * session. The API verifies the token. It reads cookies: call it inside `<Suspense>`.
 */
export const getCurrentCustomer = cache(async (): Promise<Customer | null> => {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return null;
  }

  const result = await getProfileRequest(accessToken);
  if (!result.ok || !result.data) {
    return null;
  }

  const { id, email, phone, emailVerifiedAt, firstName, lastName } =
    result.data;
  return {
    id,
    email,
    phone,
    emailVerified: emailVerifiedAt !== null,
    firstName,
    lastName,
    marketingConsent: result.data.marketingEmail,
    isProfileComplete: !!firstName && !!lastName,
  };
});
