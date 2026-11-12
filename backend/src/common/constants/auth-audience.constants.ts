/**
 * Which app a session belongs to: the `aud` claim of the JWT and the key of origin checks.
 * Staff and customers live in separate tables, so this is not stored in the database.
 */
export const AuthAudience = {
  STOREFRONT: 'STOREFRONT',
  CMS: 'CMS',
} as const;

export type AuthAudience = (typeof AuthAudience)[keyof typeof AuthAudience];
