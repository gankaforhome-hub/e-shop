/** README → Access Control & Roles: `admin` has full access, the rest one block each. */
export const CMS_ROLES = [
  'admin',
  'content-editor',
  'catalog-manager',
  'order-manager',
] as const;

export type CmsRole = (typeof CMS_ROLES)[number];

/** What is left before the CMS opens: add a key, confirm the session with it, wait for approval. */
export type KeyStep = 'add' | 'confirm' | 'approval';

export type CmsUser = {
  id: string;
  name: string;
  email: string;
  role: CmsRole;
  /** null when the session may use the CMS */
  keyStep: KeyStep | null;
  /** A root account: its keys need the enrollment code from `admin:bootstrap-root` */
  enrollmentCodeRequired: boolean;
  /** The API confirmed a root session (listed in env, signed with a root key) */
  isRoot: boolean;
};
