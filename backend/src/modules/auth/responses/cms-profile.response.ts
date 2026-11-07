import { E_StaffRole } from '@prisma/client';

export class CmsProfileResponse {
  id: string;
  email: string;
  name: string | null;
  role: E_StaffRole;
}
