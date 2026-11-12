import { z } from 'zod';

import { type Dictionary } from '@/shared/i18n/types';

export type AuthErrorKey = keyof Dictionary['auth']['errors'];

// The messages are dictionary keys; the forms translate them
const message = (key: AuthErrorKey) => key;

const email = z.string().trim().email(message('invalidEmail'));
const currentPassword = z
  .string()
  .min(1, message('required'))
  .max(72, message('passwordTooLong'));

export const signInSchema = z.object({ email, password: currentPassword });

export const forgotPasswordSchema = z.object({ email });

const newPassword = z
  .string()
  .min(8, message('passwordTooShort'))
  // bcrypt on the backend only uses the first 72 bytes
  .refine(
    value => new TextEncoder().encode(value).length <= 72,
    message('passwordTooLong'),
  );
const passwordRepeat = z.string().min(1, message('required'));
const linkToken = z.string().min(1).max(128);

const passwordsMatch = <
  T extends { password: string; passwordRepeat: string },
>({
  password,
  passwordRepeat,
}: T) => password === passwordRepeat;
const mismatch = {
  message: message('passwordsMismatch'),
  path: ['passwordRepeat'],
};

const newPasswordFields = z.object({ password: newPassword, passwordRepeat });

/** The fields of the invitation and reset forms; the token comes from the link. */
export const newPasswordSchema = newPasswordFields.refine(
  passwordsMatch,
  mismatch,
);

/** Invitation and password reset send the same body: the link token and the new password. */
export const linkPasswordSchema = newPasswordFields
  .extend({ token: linkToken })
  .refine(passwordsMatch, mismatch);

export const changePasswordSchema = newPasswordFields
  .extend({ currentPassword })
  .refine(passwordsMatch, mismatch);

export type SignInValues = z.infer<typeof signInSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordValues = z.infer<typeof newPasswordSchema>;
export type LinkPasswordValues = z.infer<typeof linkPasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
