import { E_StaffRole } from '@prisma/client';

export const TEAM_MEMBER_STATUSES = [
  'invited',
  'pending',
  'active',
  'revoked',
] as const;

export type TeamMemberStatus = (typeof TEAM_MEMBER_STATUSES)[number];

export class TeamMemberResponse {
  userId: string;
  email: string;
  name: string | null;
  role: E_StaffRole;
  /**
   * invited: the invitation is not accepted yet; pending: waits for a key (`hasKey`) and approval;
   * active: can work in the CMS; revoked: access was taken away
   */
  status: TeamMemberStatus;
  hasKey: boolean;
  /** Whether the current user may change the role or revoke the access */
  manageable: boolean;
  createdAt: Date;
}
