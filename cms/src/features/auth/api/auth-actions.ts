'use server';

import { cookies } from 'next/headers';

import { getLocale } from 'next-intl/server';

import {
  acceptInviteRequest,
  signInRequest,
  signOutRequest,
  signUpRequest,
  verifyEmailRequest,
} from '@/shared/api/auth-api';
import { routes } from '@/shared/config';
import { redirect } from '@/shared/i18n/navigation';
import {
  ACCESS_TOKEN_COOKIE,
  getSessionCookies,
  REFRESH_TOKEN_COOKIE,
} from '@/shared/lib/session/session-cookies';

import {
  acceptInviteSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
  type AcceptInviteValues,
  type AuthErrorKey,
  type SignInValues,
  type SignUpValues,
  type VerifyEmailValues,
} from '../model/auth.schema';

export type AuthActionResult =
  { ok: true } | { ok: false; error: AuthErrorKey };

function toFailure(
  status: number,
  known: Partial<Record<number, AuthErrorKey>> = {},
): AuthActionResult {
  if (status === 429) {
    return { ok: false, error: 'tooManyRequests' };
  }
  return { ok: false, error: known[status] ?? 'serverError' };
}

export async function signInAction(
  values: SignInValues,
): Promise<AuthActionResult> {
  const input = signInSchema.safeParse(values);
  if (!input.success) {
    return { ok: false, error: 'invalidCredentials' };
  }

  const result = await signInRequest(input.data);
  if (!result.ok) {
    return toFailure(result.status, { 401: 'invalidCredentials' });
  }

  const store = await cookies();
  getSessionCookies(result.data).forEach(cookie => store.set(cookie));

  return redirect({ href: routes.home, locale: await getLocale() });
}

export async function signUpAction(
  values: SignUpValues,
): Promise<AuthActionResult> {
  const input = signUpSchema.safeParse(values);
  if (!input.success) {
    return { ok: false, error: 'serverError' };
  }

  const result = await signUpRequest(input.data);

  return result.ok ? { ok: true } : toFailure(result.status);
}

export async function verifyEmailAction(
  values: VerifyEmailValues,
): Promise<AuthActionResult> {
  const input = verifyEmailSchema.safeParse(values);
  if (!input.success) {
    return { ok: false, error: 'invalidToken' };
  }

  const result = await verifyEmailRequest(input.data);

  return result.ok
    ? { ok: true }
    : toFailure(result.status, { 400: 'invalidToken', 401: 'wrongPassword' });
}

export async function acceptInviteAction(
  values: AcceptInviteValues,
): Promise<AuthActionResult> {
  const input = acceptInviteSchema.safeParse(values);
  if (!input.success) {
    return { ok: false, error: 'invalidToken' };
  }

  const { token, password } = input.data;
  const result = await acceptInviteRequest({ token, password });

  return result.ok
    ? { ok: true }
    : toFailure(result.status, { 400: 'invalidToken' });
}

export async function signOutAction(): Promise<void> {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await signOutRequest(refreshToken);
  }
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);

  redirect({ href: routes.auth.login, locale: await getLocale() });
}
