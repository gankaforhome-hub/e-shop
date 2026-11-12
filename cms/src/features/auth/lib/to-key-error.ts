import { type AuthErrorKey } from '../model/auth.schema';

/** The browser reports a cancelled or timed out key prompt as `NotAllowedError`. */
export const toKeyError = (error: unknown): AuthErrorKey =>
  error instanceof Error && error.name === 'NotAllowedError'
    ? 'keyCancelled'
    : 'keyFailed';
