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

export const signUpSchema = z
  .object({
    email,
    password: z
      .string()
      .min(8, message('passwordTooShort'))
      // bcrypt on the backend only uses the first 72 bytes
      .refine(
        value => new TextEncoder().encode(value).length <= 72,
        message('passwordTooLong'),
      ),
    passwordRepeat: z.string().min(1, message('required')),
  })
  .refine(({ password, passwordRepeat }) => password === passwordRepeat, {
    message: message('passwordsMismatch'),
    path: ['passwordRepeat'],
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(1).max(128),
  password: currentPassword,
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
