/** README → Access Control & Roles: `admin` has full access, the rest one block each. */
export const CMS_ROLES = [
  'admin',
  'content-editor',
  'catalog-manager',
  'order-manager',
] as const;

export type CmsRole = (typeof CMS_ROLES)[number];

export type CmsUser = {
  id: string;
  name: string;
  email: string;
  role: CmsRole;
};
