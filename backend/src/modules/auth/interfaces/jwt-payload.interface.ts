import { E_StaffRole } from '@prisma/client';
import { AuthAudience } from '@common/constants';

//COMMENT JWT claims: identifiers only, so email and rights can't go stale inside a token
export interface IJwtPayload {
  id: string;
  //COMMENT session id, the familyId of the refresh token
  sid: string;
  aud: AuthAudience;
  //COMMENT authenticator assurance level: 1 password, 2 password and hardware key
  aal: number;
}

export interface IStaffAccess {
  role: E_StaffRole;
  revokedAt: Date | null;
}

//COMMENT request.user, read from the database on every request
export interface IAuthUser {
  id: string;
  email: string;
  name: string | null;
  sid: string;
  aud: AuthAudience;
  aal: number;
  //COMMENT the key that raised this session to aal 2
  credentialId: string | null;
  //COMMENT keys are optional; a user with one must confirm every CMS session with it
  hasKey: boolean;
  staff: IStaffAccess | null;
}
