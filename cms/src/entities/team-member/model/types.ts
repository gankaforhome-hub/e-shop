import { type StaffRole } from '@/shared/api/auth-api';

//INFO Mirrors backend `TeamMemberResponse` (modules/staff/responses/team-member.response.ts)

export type TeamMemberStatus = 'invited' | 'pending' | 'active' | 'revoked';

export type TeamMember = {
  userId: string;
  email: string;
  name: string | null;
  role: StaffRole;
  status: TeamMemberStatus;
  hasKey: boolean;
  /** Whether the current user may change the role or revoke the access */
  manageable: boolean;
  createdAt: string;
};
