import { createHash, randomBytes } from 'crypto';

//COMMENT these tokens are long and random, so a plain SHA-256 is enough to make a DB leak useless
export const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

export const generateToken = () => randomBytes(32).toString('base64url');
