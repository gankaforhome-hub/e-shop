import * as jwt from 'jsonwebtoken';

export function isValidJWTToken(token: string, secretKey: string) {
  try {
    jwt.verify(token, secretKey);
  } catch (error) {
    return;
  }
}
