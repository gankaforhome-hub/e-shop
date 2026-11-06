import { E_UserRole } from '@prisma/client';

//COMMENT JWT claims: identifiers only, so email and roles can't go stale inside a token
export interface IJwtPayload {
  id: string;
  //COMMENT session id, the familyId of the refresh token
  sid: string;
}

//COMMENT request.user, read from the database on every request
export interface IAuthUser {
  id: string;
  email: string;
  roles: E_UserRole[];
  sid: string;
}
