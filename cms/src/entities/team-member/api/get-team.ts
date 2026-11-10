import 'server-only';

import { apiRequest, type ApiRequestResult } from '@/shared/api/api-client';

import { type TeamMember } from '../model/types';

/** Every staff member, newest first. Admins only: the API answers 403 to everyone else. */
export function getTeam(): Promise<ApiRequestResult<TeamMember[]>> {
  return apiRequest<TeamMember[]>('/admin/team');
}
