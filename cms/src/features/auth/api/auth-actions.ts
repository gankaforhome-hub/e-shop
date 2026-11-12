'use server';

import { cookies } from 'next/headers';

import {
  type AuthenticationResponseJSON,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
  type RegistrationResponseJSON,
} from '@simplewebauthn/browser';

import { getLocale } from 'next-intl/server';

import { apiRequest } from '@/shared/api/api-client';
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
  getAccessTokenCookie,
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

type AuthFailure = { ok: false; error: AuthErrorKey };

export type AuthActionResult = { ok: true } | AuthFailure;

function toFailure(
  status: number,
  known: Partial<Record<number, AuthErrorKey>> = {},
): AuthFailure {
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

export type KeyOptionsResult<T> = { ok: true; options: T } | AuthFailure;
export type AddKeyResult = { ok: true; credentialId: string } | AuthFailure;

//INFO Mirrors backend `FRESH_ASSERTION_HEADER` (modules/staff/staff.constants.ts)
const FRESH_ASSERTION_HEADER = 'x-webauthn-assertion';

const keyFailures: Partial<Record<number, AuthErrorKey>> = {
  400: 'keyFailed',
  401: 'keyFailed',
  403: 'keyFailed',
};

// With a code the API answers 403 for a wrong or expired one
const codeFailures: Partial<Record<number, AuthErrorKey>> = {
  ...keyFailures,
  403: 'enrollmentCodeInvalid',
};

/**
 * Challenge for a new key. The API allows it for the first key of a staff member (not root),
 * with an enrollment code, or from an aal 2 session with a fresh assertion (a spare key).
 */
export async function getAddKeyOptionsAction(
  enrollmentCode?: string,
): Promise<KeyOptionsResult<PublicKeyCredentialCreationOptionsJSON>> {
  const result = await apiRequest<PublicKeyCredentialCreationOptionsJSON>(
    '/auth/cms/webauthn/register/options',
    { method: 'POST', json: enrollmentCode ? { enrollmentCode } : {} },
  );
  return result.ok
    ? { ok: true, options: result.data }
    : toFailure(result.status, enrollmentCode ? codeFailures : keyFailures);
}

/**
 * Registers the key. `assertion` is the signature of an existing key over the
 * `webauthn.add_key` challenge, needed for a spare key without a code.
 * Returns the key id: a root admin adds it to `ROOT_CREDENTIAL_IDS`.
 */
export async function addKeyAction(
  response: RegistrationResponseJSON,
  {
    enrollmentCode,
    assertion,
  }: { enrollmentCode?: string; assertion?: AuthenticationResponseJSON } = {},
): Promise<AddKeyResult> {
  const result = await apiRequest<{ credentialId: string }>(
    '/auth/cms/webauthn/register/verify',
    {
      method: 'POST',
      json: { response, ...(enrollmentCode && { enrollmentCode }) },
      ...(assertion && {
        headers: {
          [FRESH_ASSERTION_HEADER]: Buffer.from(
            JSON.stringify(assertion),
          ).toString('base64url'),
        },
      }),
    },
  );
  return result.ok
    ? { ok: true, credentialId: result.data.credentialId }
    : toFailure(result.status, enrollmentCode ? codeFailures : keyFailures);
}

/** Challenge an existing key signs before a spare key is added (bound to the own id). */
export async function getSpareKeyAssertionOptionsAction(
  userId: string,
): Promise<KeyOptionsResult<PublicKeyCredentialRequestOptionsJSON>> {
  const result = await apiRequest<PublicKeyCredentialRequestOptionsJSON>(
    '/auth/cms/webauthn/assertion-options',
    { method: 'POST', json: { action: 'webauthn.add_key', targetId: userId } },
  );
  return result.ok
    ? { ok: true, options: result.data }
    : toFailure(result.status, keyFailures);
}

export async function getConfirmKeyOptionsAction(): Promise<
  KeyOptionsResult<PublicKeyCredentialRequestOptionsJSON>
> {
  const result = await apiRequest<PublicKeyCredentialRequestOptionsJSON>(
    '/auth/cms/webauthn/options',
    { method: 'POST', json: {} },
  );
  return result.ok
    ? { ok: true, options: result.data }
    : toFailure(result.status, keyFailures);
}

/** The key signed: the API raises the session and returns a new access token. */
export async function confirmKeyAction(
  response: AuthenticationResponseJSON,
): Promise<AuthActionResult> {
  const result = await apiRequest<{ accessToken: string }>(
    '/auth/cms/webauthn/verify',
    { method: 'POST', json: { response } },
  );
  if (!result.ok) {
    return toFailure(result.status, keyFailures);
  }

  const store = await cookies();
  store.set(getAccessTokenCookie(result.data.accessToken));

  return redirect({ href: routes.home, locale: await getLocale() });
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
