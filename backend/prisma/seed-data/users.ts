import { E_StaffRole } from '@prisma/client';

// Development accounts. example.com is reserved (RFC 2606): nobody can own these mailboxes.
// All share SEED_USER_PASSWORD and are verified. ROOT is not here on purpose: it needs a
// hardware key and the ROOT_* env lists, so only admin:bootstrap-root can create it.

export interface ISeedUser {
  email: string;
  name: string;
  // No role: a storefront customer
  role?: Exclude<E_StaffRole, 'ROOT'>;
}

export const SEED_USERS: ISeedUser[] = [
  { email: 'customer@example.com', name: 'Test Customer' },
  { email: 'admin@example.com', name: 'Dev Admin', role: E_StaffRole.ADMIN },
  {
    email: 'catalog@example.com',
    name: 'Dev Catalog Manager',
    role: E_StaffRole.CATALOG_MANAGER,
  },
  {
    email: 'content@example.com',
    name: 'Dev Content Editor',
    role: E_StaffRole.CONTENT_EDITOR,
  },
  {
    email: 'orders@example.com',
    name: 'Dev Order Manager',
    role: E_StaffRole.ORDER_MANAGER,
  },
];
