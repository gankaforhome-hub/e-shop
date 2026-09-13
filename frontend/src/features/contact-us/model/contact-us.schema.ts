import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';

// Описуємо точний тип для функції перекладу

type TranslationFn = (key: string) => string;

export const getContactUsSchema = (t: TranslationFn) =>
  z.object({
    email: z
      .string({ message: t('emailRequired') })
      .min(1, t('emailRequired'))
      .email(t('emailInvalid')),
    phone: z
      .string({ message: t('phoneRequired') })
      .trim()
      .min(1, t('phoneRequired'))
      .refine(
        val => {
          const phoneToParse = val.startsWith('+') ? val : `+${val}`;
          const phoneNumber = parsePhoneNumberFromString(phoneToParse);
          return phoneNumber ? phoneNumber.isValid() : false;
        },
        { message: t('phoneInvalid') },
      ),
    comment: z.string().max(300, t('commentsMax')).optional().or(z.literal('')),
  });

export type ContactUsFormData = z.infer<ReturnType<typeof getContactUsSchema>>;

export type ContactUsActionState = {
  success: boolean;
  message?: string;
  errors?: {
    [K in keyof ContactUsFormData]?: string[];
  };
};
