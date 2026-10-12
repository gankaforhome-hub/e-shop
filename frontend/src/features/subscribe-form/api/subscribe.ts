'use server';

import { getTranslations } from 'next-intl/server';

import {
  getSubscribeSchema,
  type SubscribeFormData,
  type SubscribeFormState,
} from '../model/subscribe.schema';

export async function subscribeHandler(
  data: SubscribeFormData,
): Promise<SubscribeFormState> {
  const [tValidation, tSubscribe] = await Promise.all([
    getTranslations('common.forms.validation'),
    getTranslations('common.subscribe'),
  ]);

  const schema = getSubscribeSchema(key =>
    key === 'tooLong' ? tSubscribe('firstNameTooLong') : tValidation(key),
  );
  const validated = schema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      message: tSubscribe('error'),
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // Integration point: persist `validated.data` / call the mailing provider here.
  return { success: true, message: tSubscribe('success') };
}
