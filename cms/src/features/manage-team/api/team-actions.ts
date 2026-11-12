'use server';

import { apiRequest } from '@/shared/api/api-client';

import {
  inviteSchema,
  isAssignableRole,
  type InviteValues,
  type TeamErrorKey,
} from '../model/team.schema';

export type TeamActionResult =
  { ok: true } | { ok: false; error: TeamErrorKey };

function toFailure(
  status: number,
  known: Partial<Record<number, TeamErrorKey>> = {},
): TeamActionResult {
  const byStatus: Partial<Record<number, TeamErrorKey>> = {
    400: 'revoked',
    401: 'forbidden',
    403: 'forbidden',
    404: 'notFound',
    409: 'alreadyStaff',
    429: 'tooManyRequests',
    ...known,
  };
  return { ok: false, error: byStatus[status] ?? 'serverError' };
}

/** Lost or stolen device: removes every key and session; the password still signs in. */
export async function resetKeysAction(
  userId: string,
): Promise<TeamActionResult> {
  const result = await apiRequest<void>(
    `/admin/team/${encodeURIComponent(userId)}/keys`,
    { method: 'DELETE' },
  );
  return result.ok ? { ok: true } : toFailure(result.status);
}

/** Sends (or renews) an invitation email; the API creates the account when it is new. */
export async function inviteMemberAction(
  values: InviteValues,
): Promise<TeamActionResult> {
  const input = inviteSchema.safeParse(values);
  if (!input.success) {
    return { ok: false, error: 'invalidEmail' };
  }

  const result = await apiRequest<void>('/admin/team/invite', {
    method: 'POST',
    json: input.data,
  });
  return result.ok ? { ok: true } : toFailure(result.status);
}

export async function changeRoleAction(
  userId: string,
  role: string,
): Promise<TeamActionResult> {
  if (!isAssignableRole(role)) {
    return { ok: false, error: 'forbidden' };
  }

  const result = await apiRequest<void>(
    `/admin/team/${encodeURIComponent(userId)}`,
    { method: 'PATCH', json: { role } },
  );
  return result.ok ? { ok: true } : toFailure(result.status);
}

/** Ends every session of the member at once; the account stays and can be invited again. */
export async function revokeAccessAction(
  userId: string,
): Promise<TeamActionResult> {
  const result = await apiRequest<void>(
    `/admin/team/${encodeURIComponent(userId)}`,
    { method: 'DELETE' },
  );
  return result.ok ? { ok: true } : toFailure(result.status);
}
