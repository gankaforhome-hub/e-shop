import { z } from 'zod';

import { type StaffRole } from '@/shared/api/auth-api';
import { type Dictionary } from '@/shared/i18n/types';

export type TeamErrorKey = keyof Dictionary['team']['errors'];

/** Roles the CMS can give; ROOT only comes from the CLI. */
export const ASSIGNABLE_ROLES = [
  'CONTENT_EDITOR',
  'CATALOG_MANAGER',
  'ORDER_MANAGER',
  'ADMIN',
] as const satisfies readonly StaffRole[];

export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

/** ADMIN only for a key-confirmed root; the API enforces the same rule. */
export const getAssignableRoles = (
  canAssignAdmin: boolean,
): readonly AssignableRole[] =>
  canAssignAdmin
    ? ASSIGNABLE_ROLES
    : ASSIGNABLE_ROLES.filter(role => role !== 'ADMIN');

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
