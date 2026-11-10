import { z } from 'zod';

import { type StaffRole } from '@/shared/api/auth-api';
import { type Dictionary } from '@/shared/i18n/types';

export type TeamErrorKey = keyof Dictionary['team']['errors'];

/**
 * Roles an ADMIN may give. ADMIN itself needs a key-confirmed root (staff key plan K),
 * so the CMS does not offer it yet; the API enforces the same rule.
 */
export const ASSIGNABLE_ROLES = [
  'CONTENT_EDITOR',
  'CATALOG_MANAGER',
  'ORDER_MANAGER',
] as const satisfies readonly StaffRole[];

export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export const isAssignableRole = (role: string): role is AssignableRole =>
  (ASSIGNABLE_ROLES as readonly string[]).includes(role);

// The messages are keys of `team.errors`; the form translates them
const message = (key: TeamErrorKey) => key;

//INFO Mirrors backend `InviteStaffDto`
export const inviteSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, message('required'))
    .email(message('invalidEmail')),
  role: z.enum(ASSIGNABLE_ROLES),
});

export type InviteValues = z.infer<typeof inviteSchema>;
