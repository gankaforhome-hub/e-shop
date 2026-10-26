import { z } from 'zod';

import { isValidPhone, stripWhitespace, toE164 } from '../lib/sanitize';

type TranslationFn = (key: string) => string;

export const LEAD_COMMENT_MAX = 300;

/**
 * Lead form rules. Inputs are sanitized before validation (whitespace in
 * e-mails, padding from autofill), and the phone leaves the schema as E.164,
 * so `z.output` is exactly what gets sent.
 */
export const getLeadFormSchema = (t: TranslationFn) =>
  z.object({
    email: z
      .string()
      .transform(stripWhitespace)
      .pipe(z.string().min(1, t('emailRequired')).email(t('emailInvalid'))),
    phone: z
      .string()
      .trim()
      .min(1, t('phoneRequired'))
      .refine(isValidPhone, { message: t('phoneInvalid') })
      .transform(toE164),
    comment: z.string().trim().max(LEAD_COMMENT_MAX, t('commentsMax')),
  });

export type LeadFormInput = z.input<ReturnType<typeof getLeadFormSchema>>;
export type LeadFormValues = z.output<ReturnType<typeof getLeadFormSchema>>;
