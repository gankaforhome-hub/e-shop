import { E_AuthAudience, E_StaffRole } from '@prisma/client';

//COMMENT JWT claims: identifiers only, so email and rights can't go stale inside a token
export interface IJwtPayload {
  id: string;
  //COMMENT session id, the familyId of the refresh token
  sid: string;
  aud: E_AuthAudience;
  //COMMENT authenticator assurance level: 1 password, 2 password and hardware key
  aal: number;
}

export interface IStaffAccess {
  role: E_StaffRole;
  approvedAt: Date | null;
  revokedAt: Date | null;
}

//COMMENT request.user, read from the database on every request
export interface IAuthUser {
  id: string;
  email: string;
  sid: string;
  aud: E_AuthAudience;
  aal: number;
  //COMMENT the key that raised this session to aal 2
  credentialId: string | null;
  staff: IStaffAccess | null;
}
