export const FRESH_ASSERTION_HEADER = 'x-webauthn-assertion';

export const FRESH_ACTIONS = [
  'staff.grant',
  'staff.revoke',
  'webauthn.add_key',
] as const;

export type FreshAction = (typeof FRESH_ACTIONS)[number];
