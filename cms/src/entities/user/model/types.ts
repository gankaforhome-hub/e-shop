/** README → Access Control & Roles: `admin` has full access, the rest one block each. */
export const CMS_ROLES = [
  'admin',
  'content-editor',
  'catalog-manager',
  'order-manager',
] as const;

export type CmsRole = (typeof CMS_ROLES)[number];

/**
 * Left before the CMS opens: a root without a key adds one (with the env enrollment code),
 * anyone with a key confirms the session with it.
 */
export type KeyStep = 'add' | 'confirm';

export type CmsUser = {
  id: string;
  name: string;
  email: string;
  role: CmsRole;
  /** null when the session may use the CMS */
  keyStep: KeyStep | null;
  /** At least one sign-in key is registered (optional, except for root) */
  hasKey: boolean;
  /** Role ROOT: keys need the env enrollment code first and their ids go to ROOT_CREDENTIAL_IDS */
  isRootRole: boolean;
  /** The API confirmed a root session (listed in env, confirmed with a listed root key) */
  isRoot: boolean;
};
