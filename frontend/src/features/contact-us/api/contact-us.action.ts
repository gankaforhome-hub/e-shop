'use server';

import { getTranslations } from 'next-intl/server';

import {
  type ContactUsActionState,
  getContactUsSchema,
} from '../model/contact-us.schema';

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function submitContactUsAction(
  _prevState: ContactUsActionState,
  formData: FormData,
): Promise<ContactUsActionState> {
  const tForms = await getTranslations('common.forms');

  const contactUsSchema = getContactUsSchema(key =>
    tForms(`validation.${key}` as Parameters<typeof tForms>[0]),
  );

  const rawData = {
    email: getFormString(formData, 'email'),
    phone: getFormString(formData, 'phone'),
    comment: getFormString(formData, 'comment'),
  };

  const validated = contactUsSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      message: tForms('status.success'),
    };
  } catch (error) {
    // eslint-disable-next-line no-console -- server-side error trail
    console.error('[Server Action Error]:', error);

    return {
      success: false,
      message: tForms('status.error'),
    };
  }
}
