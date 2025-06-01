import { z } from 'zod';

export const subscribeSchema = z.object({
  firstName: z
    .string({ message: 'First name is required' })
    .min(3, 'Name should have at least 3 characters')
    .max(100, 'Too long first name'),
  emailSubscription: z
    .string({ message: 'E-mail is required' })
    .email('Invalid email'),
});

export type SubscribeFormData = z.infer<typeof subscribeSchema>;

export interface SubscribeFormState {
  success: boolean;
  message: string;
  data?: SubscribeFormData;
  errors?: {
    [K in keyof SubscribeFormData]?: string[];
  };
}

export type SubscribeFormField = {
  name: keyof SubscribeFormData;
  type: 'text' | 'email';
  label: string;
  placeholder: string;
};

export type Notifications = {
  success: {
    title: string;
    text: string;
  };
  error: string;
};

export type FormSubscribe = {
  inputs: SubscribeFormField[];
  buttonText: string;
  notifications: Notifications;
};
