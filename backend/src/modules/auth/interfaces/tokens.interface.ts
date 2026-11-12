import { type SessionToken } from '../repository/auth.repository';

export interface ITokens {
  accessToken: string;
  //COMMENT the stored session row, with `token` replaced by the raw value for the cookie
  refreshToken: SessionToken;
}
