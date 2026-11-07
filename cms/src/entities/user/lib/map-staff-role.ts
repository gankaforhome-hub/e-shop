import { type StaffRole } from '@/shared/api/auth-api';

import { type CmsRole } from '../model/types';

/** A root admin sees what `admin` sees; the backend guards what only root may do. */
const CMS_ROLE_BY_STAFF_ROLE: Record<StaffRole, CmsRole> = {
  ROOT: 'admin',
  ADMIN: 'admin',
  CONTENT_EDITOR: 'content-editor',
  CATALOG_MANAGER: 'catalog-manager',
  ORDER_MANAGER: 'order-manager',
};

export const mapStaffRole = (role: StaffRole): CmsRole =>
  CMS_ROLE_BY_STAFF_ROLE[role];
