import { z } from 'zod';

type TranslationFn = (
  key: 'required' | 'tooShort' | 'emailRequired' | 'emailInvalid' | 'tooLong',
) => string;

/** Schema factory so client and server validate with the same localized messages. */
export const getSubscribeSchema = (t: TranslationFn) =>
  z.object({
    firstName: z
      .string({ message: t('required') })
      .trim()
      .min(3, t('tooShort'))
      .max(100, t('tooLong')),
    emailSubscription: z
      .string({ message: t('emailRequired') })
      .trim()
      .min(1, t('emailRequired'))
      .email(t('emailInvalid')),
  });

export type SubscribeFormData = z.infer<ReturnType<typeof getSubscribeSchema>>;

export type SubscribeFormState = {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof SubscribeFormData]?: string[];
  };
};

export type SubscribeFormField = {
  name: keyof SubscribeFormData;
  type: 'text' | 'email';
  label: string;
  placeholder: string;
};

export type FormSubscribe = {
  inputs: SubscribeFormField[];
  buttonText: string;
};
