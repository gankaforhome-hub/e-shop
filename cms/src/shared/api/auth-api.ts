import { type SessionTokens } from '@/shared/lib/session/session-cookies';

import { fetchApi, NETWORK_ERROR_STATUS } from './fetch-api';

//INFO Server side only (Server Actions, proxy, DAL). The browser never calls the API,
//INFO so the tokens stay out of page scripts and no CORS is needed.

const API_REFRESH_COOKIE = 'CMS_REFRESH_TOKEN';

export type ApiFailure = { ok: false; status: number };
export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
  accessToken?: string;
  refreshToken?: string;
};

type RawResult<T> = { ok: true; data: T; setCookie: string[] } | ApiFailure;

async function request<T>(
  path: string,
  { method = 'POST', body, accessToken, refreshToken }: RequestOptions = {},
): Promise<RawResult<T>> {
  const response = await fetchApi(path, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(refreshToken
        ? { Cookie: `${API_REFRESH_COOKIE}=${refreshToken}` }
        : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response) {
    return { ok: false, status: NETWORK_ERROR_STATUS };
  }
  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  try {
    return {
      ok: true,
      // The contract of each endpoint is owned by the backend
      data: (response.status === 204 ? undefined : await response.json()) as T,
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
  const result = await request<{ accessToken: string }>('/auth/cms/sign-in', {
    body: credentials,
  });

  return result.ok
    ? toSessionTokens(result.data.accessToken, result.setCookie)
    : result;
}

export async function refreshSessionRequest(
  refreshToken: string,
): Promise<ApiResult<SessionTokens>> {
  const result = await request<{ accessToken: string }>('/auth/cms/refresh', {
    refreshToken,
  });

  return result.ok
    ? toSessionTokens(result.data.accessToken, result.setCookie)
    : result;
}

export async function signOutRequest(refreshToken: string): Promise<void> {
  await request('/auth/cms/sign-out', { refreshToken });
}

/**
 * Sets the password of an invited staff member; the link also confirms the email.
 * Returns the invited email, so the CMS can sign the person in at once.
 */
export async function acceptInviteRequest(input: {
  token: string;
  password: string;
}): Promise<ApiResult<{ email: string }>> {
  return request<{ email: string }>('/auth/cms/accept-invite', { body: input });
}

/** Emails a reset link; the API answers the same for unknown addresses. */
export async function forgotPasswordRequest(input: {
  email: string;
}): Promise<ApiResult<void>> {
  return request<void>('/auth/cms/forgot-password', { body: input });
}

/** Sets a new password with the token from the reset link; ends every session. */
export async function resetPasswordRequest(input: {
  token: string;
  password: string;
}): Promise<ApiResult<void>> {
  return request<void>('/auth/cms/reset-password', { body: input });
}

export type StaffRole =
  'ROOT' | 'ADMIN' | 'CONTENT_EDITOR' | 'CATALOG_MANAGER' | 'ORDER_MANAGER';

export type CmsProfile = {
  id: string;
  email: string;
  name: string | null;
  role: StaffRole;
  /** At least one key is registered: every sign-in is confirmed with it */
  hasKey: boolean;
  /** The session was confirmed with a key */
  keyConfirmed: boolean;
  /** A root listed in ROOT_USER_IDS of the API: may assign ADMIN */
  isRoot: boolean;
};

export async function getProfileRequest(
  accessToken: string,
): Promise<ApiResult<CmsProfile>> {
  return request<CmsProfile>('/auth/cms/me', { method: 'GET', accessToken });
}
