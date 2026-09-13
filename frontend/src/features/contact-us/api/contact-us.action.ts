'use server';

import { getTranslations } from 'next-intl/server';

import {
  type ContactUsActionState,
  getContactUsSchema,
} from '../model/contact-us.schema';

export async function submitContactUsAction(
  _prevState: ContactUsActionState,
  formData: FormData,
): Promise<ContactUsActionState> {
  const tForms = await getTranslations('common.forms');

  const contactUsSchema = getContactUsSchema(key =>
    tForms(`validation.${key}` as Parameters<typeof tForms>[0]),
  );

  const rawData = {
    email: (formData.get('email') as string) ?? '',
    phone: (formData.get('phone') as string) ?? '',
    comment: (formData.get('comment') as string) ?? '',
  };

  const validated = contactUsSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    console.log('[Server Action] Contact Us payload:', validated.data);

    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      message: tForms('status.success'),
    };
  } catch (error) {
    console.error('[Server Action Error]:', error);

    return {
      success: false,
      message: tForms('status.error'),
    };
  }
}
