import { type SessionTokens } from '@/shared/lib/session';

//INFO Server side only (Server Actions, proxy, DAL); the browser never calls the API, so the
//INFO tokens stay out of page scripts. No `server-only` import: `proxy.ts` uses it too.
//INFO Cookie routes check the Origin header against STOREFRONT_ORIGINS of the API.

const API_REFRESH_COOKIE = 'REFRESH_TOKEN';
const REQUEST_TIMEOUT_MS = 10_000;
export const NETWORK_ERROR_STATUS = 503;

export type ApiFailure = { ok: false; status: number };
export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH';
  body?: unknown;
  accessToken?: string;
  refreshToken?: string;
};

type RawResult<T> = { ok: true; data: T; setCookie: string[] } | ApiFailure;

const getApiUrl = () =>
  (process.env.API_URL ?? 'http://localhost:3001/api').replace(/\/+$/, '');

const getStorefrontOrigin = () =>
  new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').origin;

async function request<T>(
  path: string,
  { method = 'POST', body, accessToken, refreshToken }: RequestOptions = {},
): Promise<RawResult<T>> {
  let response: Response;
  try {
    response = await fetch(`${getApiUrl()}${path}`, {
      method,
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Origin: getStorefrontOrigin(),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(refreshToken
          ? { Cookie: `${API_REFRESH_COOKIE}=${refreshToken}` }
          : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    return { ok: false, status: NETWORK_ERROR_STATUS };
  }

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  try {
    const text = await response.text();
    return {
      ok: true,
      // The contract of each endpoint is owned by the backend (Swagger)
      data: (text ? JSON.parse(text) : undefined) as T,
      setCookie: response.headers.getSetCookie(),
    };
  } catch {
    return { ok: false, status: NETWORK_ERROR_STATUS };
  }
}

function toSessionTokens(
  accessToken: string,
  setCookie: string[],
): ApiResult<SessionTokens> {
  const cookie = setCookie.find(item =>
    item.startsWith(`${API_REFRESH_COOKIE}=`),
  );
  const [pair = '', ...attributes] = cookie?.split(';') ?? [];
  const expires = attributes
    .map(attribute => attribute.trim())
    .find(attribute => attribute.toLowerCase().startsWith('expires='))
    ?.slice('expires='.length);

  if (!cookie || !expires) {
    return { ok: false, status: NETWORK_ERROR_STATUS };
  }

  return {
    ok: true,
    data: {
      accessToken,
      refreshToken: decodeURIComponent(
        pair.slice(API_REFRESH_COOKIE.length + 1),
      ),
      refreshExpires: new Date(expires),
    },
  };
}

export async function signInRequest(credentials: {
  email: string;
  password: string;
}): Promise<ApiResult<SessionTokens>> {
  const result = await request<{ accessToken: string }>('/auth/sign-in', {
    body: credentials,
  });

  return result.ok
    ? toSessionTokens(result.data.accessToken, result.setCookie)
    : result;
}

/** Google authorization code → session; the API merges it with the account of the same email. */
export async function googleSignInRequest(input: {
  code: string;
  redirectUri: string;
}): Promise<ApiResult<SessionTokens>> {
  const result = await request<{ accessToken: string }>('/auth/google', {
    body: input,
  });

  return result.ok
    ? toSessionTokens(result.data.accessToken, result.setCookie)
    : result;
}

export async function refreshSessionRequest(
  refreshToken: string,
): Promise<ApiResult<SessionTokens>> {
  const result = await request<{ accessToken: string }>('/auth/refresh', {
    refreshToken,
  });

  return result.ok
    ? toSessionTokens(result.data.accessToken, result.setCookie)
    : result;
}

export async function signOutRequest(refreshToken: string): Promise<void> {
  await request('/auth/sign-out', { refreshToken });
}

/** 202 for new and existing emails alike, so it never tells which accounts exist. */
export function signUpRequest(input: {
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  marketingConsent: boolean;
  email: string;
  password: string;
  passwordRepeat: string;
  phone?: string | undefined;
  turnstileToken?: string | undefined;
}): Promise<ApiResult<unknown>> {
  return request('/auth/sign-up', { body: input });
}

export function forgotPasswordRequest(input: {
  email: string;
  turnstileToken?: string | undefined;
}): Promise<ApiResult<unknown>> {
  return request('/auth/forgot-password', { body: input });
}

export function resetPasswordRequest(input: {
  token: string;
  password: string;
}): Promise<ApiResult<unknown>> {
  return request('/auth/reset-password', { body: input });
}

/** Confirms the email; works only in the session of the account the link was sent for. */
export function verifyEmailRequest(
  input: { token: string },
  accessToken: string,
): Promise<ApiResult<unknown>> {
  return request('/auth/verify-email', { body: input, accessToken });
}

/** A fresh confirmation link to the signed-in customer's own address. */
export function resendVerificationRequest(
  accessToken: string,
): Promise<ApiResult<unknown>> {
  return request('/auth/resend-verification', { accessToken });
}

/** Mirrors backend `CustomerResponse` (modules/customer/responses/customer.response.ts). */
export type CustomerProfile = {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  phone: string | null;
  phoneVerifiedAt: string | null;
  firstName: string | null;
  lastName: string | null;
  /** Current news-and-offers choice (the proof is the consent journal) */
  marketingEmail: boolean;
  /** false: the account only signs in with Google */
  hasPassword: boolean;
};

/** The own profile: names, phone (null removes it), news-and-offers consent. 409: phone taken. */
export function updateProfileRequest(
  input: {
    firstName: string;
    lastName: string;
    phone: string | null;
    marketingConsent: boolean;
  },
  accessToken: string,
): Promise<ApiResult<CustomerProfile>> {
  return request<CustomerProfile>('/user/me', {
    method: 'PATCH',
    body: input,
    accessToken,
  });
}

export function getProfileRequest(
  accessToken: string,
): Promise<ApiResult<CustomerProfile | null>> {
  return request<CustomerProfile | null>('/user/me', {
    method: 'GET',
    accessToken,
  });
}
