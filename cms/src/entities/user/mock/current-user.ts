import { type CmsUser } from '../model/types';

/** Signed-in user until authentication lands. */
export const mockCurrentUser: CmsUser = {
  id: 'user-admin',
  name: 'Ganka Admin',
  email: 'admin@example.com',
  role: 'admin',
};
