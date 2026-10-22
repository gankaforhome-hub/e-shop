import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';

import {
  deliveryMethods,
  deliveryRegions,
  isPaymentAvailable,
  paymentMethods,
  ukraineDeliveryMethods,
  type DeliveryMethod,
  type DeliveryRegion,
} from '@/entities/order';
import { type CommonDict } from '@/shared/i18n/types';

export type CheckoutValidationKey = keyof CommonDict['checkout']['validation'];

type TranslateFn = (key: CheckoutValidationKey) => string;

const SHORT_TEXT_MAX = 100;
const ADDRESS_MAX = 200;
const COMMENT_MAX = 500;

// Letters in any script plus space, hyphen and the apostrophes used in Ukrainian names
export const NAME_PATTERN = /^\p{L}[\p{L}\s'’ʼ-]*$/u;
export const POSTAL_CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/;

const NOVA_POSHTA_POINT_METHODS: readonly DeliveryMethod[] = [
  'nova_poshta_branch',
  'nova_poshta_locker',
];
const STREET_ADDRESS_METHODS: readonly DeliveryMethod[] = [
  'nova_poshta_courier',
  'scheduled_courier',
];

export const isNovaPoshtaPointMethod = (method: DeliveryMethod) =>
  NOVA_POSHTA_POINT_METHODS.includes(method);

export const isStreetAddressMethod = (method: DeliveryMethod) =>
  STREET_ADDRESS_METHODS.includes(method);

/** `react-phone-input-2` emits digits only ("380…"); normalize to E.164. */
export const toE164 = (value: string) =>
  value.startsWith('+') ? value : `+${value}`;

/** Any valid number; Ukrainian delivery also requires a `+380` number. */
export function getPhoneIssue(
  value: string,
  region: DeliveryRegion,
): 'phoneInvalid' | 'phoneUaInvalid' | null {
  const phone = parsePhoneNumberFromString(toE164(value));
  if (!phone?.isValid()) {
    return 'phoneInvalid';
  }
  return region === 'ua' && phone.country !== 'UA' ? 'phoneUaInvalid' : null;
}

export const getCheckoutSchema = (t: TranslateFn) => {
  const text = (max = SHORT_TEXT_MAX) =>
    z.string().trim().max(max, t('tooLong'));

  return z
    .object({
      region: z.enum(deliveryRegions),
      firstName: text()
        .min(1, t('firstNameRequired'))
        .regex(NAME_PATTERN, t('nameInvalid')),
      lastName: text()
        .min(1, t('lastNameRequired'))
        .regex(NAME_PATTERN, t('nameInvalid')),
      phone: z.string().trim().min(1, t('phoneRequired')),
      email: text().min(1, t('emailRequired')).email(t('emailInvalid')),
      deliveryMethod: z.enum(deliveryMethods),
      city: text(),
      npPoint: text(ADDRESS_MAX),
      street: text(),
      house: text(20),
      flat: text(20),
      preferredTime: text(),
      country: text(),
      postalCode: text(20),
      address: text(ADDRESS_MAX),
      billingSameAsShipping: z.boolean(),
      billingAddress: text(ADDRESS_MAX),
      paymentMethod: z.enum(paymentMethods),
      comment: z.string().trim().max(COMMENT_MAX, t('commentMax')),
      acceptTerms: z.boolean().refine(accepted => accepted, t('termsRequired')),
    })
    .superRefine((values, ctx) => {
      const requireField = (
        field: keyof typeof values,
        message: CheckoutValidationKey,
      ) => {
        if (!values[field]) {
          ctx.addIssue({ code: 'custom', path: [field], message: t(message) });
        }
      };

      const isUkraine = values.region === 'ua';
      const method = values.deliveryMethod;

      const phoneIssue = values.phone
        ? getPhoneIssue(values.phone, values.region)
        : null;
      if (phoneIssue) {
        ctx.addIssue({
          code: 'custom',
          path: ['phone'],
          message: t(phoneIssue),
        });
      }

      // Region and method must agree; the form keeps them in sync, this guards the server
      const isUkraineMethod = (
        ukraineDeliveryMethods as readonly DeliveryMethod[]
      ).includes(method);
      if (isUkraine !== isUkraineMethod) {
        ctx.addIssue({ code: 'custom', path: ['deliveryMethod'], message: '' });
      }

      if (!isPaymentAvailable(values.paymentMethod, values.region)) {
        ctx.addIssue({
          code: 'custom',
          path: ['paymentMethod'],
          message: t('paymentUnavailable'),
        });
      }

      requireField('city', 'cityRequired');

      if (method === 'nova_poshta_branch') {
        requireField('npPoint', 'branchRequired');
      }
      if (method === 'nova_poshta_locker') {
        requireField('npPoint', 'lockerRequired');
      }
      if (isStreetAddressMethod(method)) {
        requireField('street', 'streetRequired');
        requireField('house', 'houseRequired');
      }
      if (method === 'scheduled_courier') {
        requireField('preferredTime', 'preferredTimeRequired');
      }

      if (!isUkraine) {
        requireField('country', 'countryRequired');
        requireField('postalCode', 'postalCodeRequired');
        requireField('address', 'addressRequired');
        if (values.postalCode && !POSTAL_CODE_PATTERN.test(values.postalCode)) {
          ctx.addIssue({
            code: 'custom',
            path: ['postalCode'],
            message: t('postalCodeInvalid'),
          });
        }
        if (!values.billingSameAsShipping) {
          requireField('billingAddress', 'billingAddressRequired');
        }
      }
    });
};

export type CheckoutFormValues = z.infer<ReturnType<typeof getCheckoutSchema>>;

export type CheckoutFieldName = keyof CheckoutFormValues;

export const CHECKOUT_DEFAULT_VALUES: CheckoutFormValues = {
  region: 'ua',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  deliveryMethod: 'nova_poshta_branch',
  city: '',
  npPoint: '',
  street: '',
  house: '',
  flat: '',
  preferredTime: '',
  country: '',
  postalCode: '',
  address: '',
  billingSameAsShipping: true,
  billingAddress: '',
  paymentMethod: 'liqpay',
  comment: '',
  acceptTerms: false,
};
