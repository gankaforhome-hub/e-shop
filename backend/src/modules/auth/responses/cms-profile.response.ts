import { E_StaffRole } from '@prisma/client';

export class CmsProfileResponse {
  id: string;
  email: string;
  name: string | null;
  role: E_StaffRole;
  /** At least one key is registered */
  hasKey: boolean;
  /** This session was confirmed with a key (aal 2) */
  keyConfirmed: boolean;
  /** A root listed in ROOT_USER_IDS: may assign ADMIN */
  isRoot: boolean;
}
