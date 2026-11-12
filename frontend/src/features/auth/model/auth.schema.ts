import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';

import { type AccountDict } from '@/shared/i18n/types';

export type AccountErrorKey = keyof AccountDict['errors'];

// The messages are dictionary keys; the forms translate them
const message = (key: AccountErrorKey) => key;

const email = z
  .string()
  .transform(value => value.replace(/\s+/g, ''))
  .pipe(z.string().min(1, message('required')).email(message('invalidEmail')));

const currentPassword = z
  .string()
  .min(1, message('required'))
  .max(72, message('passwordTooLong'));

const newPassword = z
  .string()
  .min(8, message('passwordTooShort'))
  // bcrypt on the backend only uses the first 72 bytes
  .refine(
    value => new TextEncoder().encode(value).length <= 72,
    message('passwordTooLong'),
  );

const passwordRepeat = z.string().min(1, message('required'));

const passwordsMatch = ({
  password,
  passwordRepeat: repeat,
}: {
  password: string;
  passwordRepeat: string;
}) => password === repeat;
const mismatch = {
  message: message('passwordsMismatch'),
  path: ['passwordRepeat'],
};

// The phone input emits digits without "+" and starts with the country code alone
const parsePhone = (value: string) =>
  parsePhoneNumberFromString(value.startsWith('+') ? value : `+${value}`);
const isBlankPhone = (value: string) => value.replace(/\D/g, '').length <= 4;

/** Optional: blank (only the country code) → undefined, otherwise a valid number as E.164. */
const optionalPhone = z
  .string()
  .optional()
  .refine(
    value => !value || isBlankPhone(value) || !!parsePhone(value)?.isValid(),
    {
      message: message('invalidPhone'),
    },
  )
  .transform(value =>
    !value || isBlankPhone(value) ? undefined : parsePhone(value)?.number,
  );

const personName = z
  .string()
  .trim()
  .min(1, message('required'))
  .max(100, message('nameTooLong'));

export const signInSchema = z.object({ email, password: currentPassword });

export const signUpSchema = z
  .object({
    firstName: personName,
    lastName: personName,
    email,
    phone: optionalPhone,
    password: newPassword,
    passwordRepeat,
    // The terms and the privacy policy must be accepted; the API stores the version
    acceptTerms: z.boolean().refine(value => value, message('acceptTerms')),
    marketingConsent: z.boolean(),
  })
  .refine(passwordsMatch, mismatch);

/** Profile completion and editing (names, phone, news and offers). */
export const profileSchema = z.object({
  firstName: personName,
  lastName: personName,
  phone: optionalPhone,
  marketingConsent: z.boolean(),
});

export const forgotPasswordSchema = z.object({ email });

export const newPasswordSchema = z
  .object({ password: newPassword, passwordRepeat })
  .refine(passwordsMatch, mismatch);

export const linkTokenSchema = z.string().min(1).max(128);

export type SignInInput = z.input<typeof signInSchema>;
export type SignUpInput = z.input<typeof signUpSchema>;
export type SignUpValues = z.output<typeof signUpSchema>;
export type ProfileInput = z.input<typeof profileSchema>;
export type ProfileValues = z.output<typeof profileSchema>;
export type ForgotPasswordInput = z.input<typeof forgotPasswordSchema>;
export type NewPasswordInput = z.input<typeof newPasswordSchema>;
