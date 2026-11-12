'use server';

import { cookies } from 'next/headers';

import { getLocale } from 'next-intl/server';

import {
  forgotPasswordRequest,
  resendVerificationRequest,
  resetPasswordRequest,
  signInRequest,
  signOutRequest,
  signUpRequest,
  updateProfileRequest,
  verifyEmailRequest,
} from '@/shared/api/auth-api';
import { routes } from '@/shared/config/routes';
import { redirect } from '@/shared/i18n/navigation';
import {
  ACCESS_TOKEN_COOKIE,
  getSessionCookies,
  REFRESH_TOKEN_COOKIE,
} from '@/shared/lib/session';

import {
  forgotPasswordSchema,
  linkTokenSchema,
  newPasswordSchema,
  profileSchema,
  signInSchema,
  signUpSchema,
  type AccountErrorKey,
  type ForgotPasswordInput,
  type NewPasswordInput,
  type ProfileInput,
  type SignInInput,
  type SignUpInput,
} from '../model/auth.schema';

type Failure = { ok: false; error: AccountErrorKey };
export type AuthActionResult = { ok: true } | Failure;
/** `checkEmail`: the address already has an account; the email tells the owner. */
export type SignUpResult = { ok: true; checkEmail: true } | Failure;

function toFailure(
  status: number,
  known: Partial<Record<number, AccountErrorKey>> = {},
): Failure {
  if (status === 429) {
    return { ok: false, error: 'tooManyRequests' };
  }
  return { ok: false, error: known[status] ?? 'serverError' };
}

/**
 * Stores the session cookies; `null` when the password is wrong. Opens the account page,
 * or with `stay` returns `ok` so the current page (e.g. the email confirmation) can go on.
 */
async function startSession(
  credentials: { email: string; password: string },
  stay = false,
): Promise<AuthActionResult | null> {
  const result = await signInRequest(credentials);
  if (!result.ok) {
    return result.status === 401 ? null : toFailure(result.status);
  }

  const store = await cookies();
  getSessionCookies(result.data).forEach(cookie => store.set(cookie));

  if (stay) {
    return { ok: true };
  }
  return redirect({ href: routes.account, locale: await getLocale() });
}

export async function signInAction(
  values: SignInInput,
  { stay = false }: { stay?: boolean } = {},
): Promise<AuthActionResult> {
  const input = signInSchema.safeParse(values);
  if (!input.success) {
    return { ok: false, error: 'invalidCredentials' };
  }

  return (
    (await startSession(input.data, stay)) ?? {
      ok: false,
      error: 'invalidCredentials',
    }
  );
}

/**
 * A new account works at once, so the action signs in right after. The API answers the same
 * for a taken email or phone; then the sign-in fails and the form says "check your email".
 */
export async function signUpAction(
  values: SignUpInput,
  turnstileToken?: string,
): Promise<SignUpResult> {
  const input = signUpSchema.safeParse(values);
  if (!input.success) {
    return { ok: false, error: 'serverError' };
  }

  const { email, password, passwordRepeat, ...profile } = input.data;
  const result = await signUpRequest({
    ...profile,
    email,
    password,
    passwordRepeat,
    turnstileToken,
  });
  if (!result.ok) {
    return toFailure(result.status, { 400: 'botCheck' });
  }

  // On success startSession redirects; null (wrong password) means the address was taken
  const session = await startSession({ email, password });
  return session && !session.ok ? session : { ok: true, checkEmail: true };
}

/** Saves names, phone and the news-and-offers choice of the signed-in customer. */
export async function updateProfileAction(
  values: ProfileInput,
): Promise<AuthActionResult> {
  const input = profileSchema.safeParse(values);
  if (!input.success) {
    return { ok: false, error: 'serverError' };
  }

  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return { ok: false, error: 'signInToConfirm' };
  }

  const { phone, ...rest } = input.data;
  const result = await updateProfileRequest(
    { ...rest, phone: phone ?? null },
    accessToken,
  );

  return result.ok
    ? { ok: true }
    : toFailure(result.status, { 409: 'phoneTaken' });
}

/** Always "check your email": the API never tells whether the address exists. */
export async function forgotPasswordAction(
  values: ForgotPasswordInput,
  turnstileToken?: string,
): Promise<AuthActionResult> {
  const input = forgotPasswordSchema.safeParse(values);
  if (!input.success) {
    return { ok: false, error: 'invalidEmail' };
  }

  const result = await forgotPasswordRequest({
    email: input.data.email,
    turnstileToken,
  });

  return result.ok
    ? { ok: true }
    : toFailure(result.status, { 400: 'botCheck' });
}

/** Until this succeeds the old password keeps working. */
export async function resetPasswordAction(
  token: string,
  values: NewPasswordInput,
): Promise<AuthActionResult> {
  const tokenInput = linkTokenSchema.safeParse(token);
  const input = newPasswordSchema.safeParse(values);
  if (!tokenInput.success || !input.success) {
    return { ok: false, error: 'invalidToken' };
  }

  const result = await resetPasswordRequest({
    token: tokenInput.data,
    password: input.data.password,
  });

  return result.ok
    ? { ok: true }
    : toFailure(result.status, { 400: 'invalidToken' });
}

export async function verifyEmailAction(
  token: string,
): Promise<AuthActionResult> {
  const input = linkTokenSchema.safeParse(token);
  if (!input.success) {
    return { ok: false, error: 'invalidToken' };
  }

  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return { ok: false, error: 'signInToConfirm' };
  }

  // The API confirms only for the account the link was sent for
  const result = await verifyEmailRequest({ token: input.data }, accessToken);

  return result.ok
    ? { ok: true }
    : toFailure(result.status, { 400: 'invalidToken', 401: 'signInToConfirm' });
}

/** Sends the confirmation link to the signed-in customer's own address. */
export async function resendVerificationAction(): Promise<AuthActionResult> {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return { ok: false, error: 'signInToConfirm' };
  }

  const result = await resendVerificationRequest(accessToken);

  return result.ok ? { ok: true } : toFailure(result.status);
}

export async function signOutAction(): Promise<void> {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await signOutRequest(refreshToken);
  }
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);

  redirect({ href: routes.home, locale: await getLocale() });
}
