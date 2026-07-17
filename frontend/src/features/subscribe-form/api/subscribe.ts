'use server';

import { wait } from '@/shared/lib/utils';

import {
  type SubscribeFormData,
  type SubscribeFormState,
  subscribeSchema,
} from '../model/subscribe.schema';

export const subscribeHandler = async (
  data: SubscribeFormData,
): Promise<SubscribeFormState> => {
  //FIXME Remove when there will be a request to the server
  await wait(4000);

  try {
    const validatedData = subscribeSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'Please fix the errors in the form',
        errors: validatedData.error.flatten().fieldErrors,
        data: data,
      };
    }
    // TODO: Save/Request/Integration Logic
    //COMMENT Here you would typically save the address to your database
    // const simulateError = true;
    // if (simulateError) {
    //   throw new Error();
    // }

    console.log('Address submitted:', validatedData.data);
    return {
      success: true,
      message: 'You have successfully signed up!',
    };
  } catch {
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
};
