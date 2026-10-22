import { z } from 'zod';

import {
  deliveryMethods,
  deliveryRegions,
  isPaymentAvailable,
  paymentMethods,
  ukraineDeliveryMethods,
  type DeliveryMethod,
} from '@/entities/order';

import {
  getPhoneIssue,
  NAME_PATTERN,
  POSTAL_CODE_PATTERN,
} from './checkout.schema';
import { isOrderId } from '../lib/build-order-payload';

const MAX_LINE_QUANTITY = 99;
const MAX_ORDER_LINES = 100;

const text = (max: number) => z.string().trim().max(max);
const name = text(100).regex(NAME_PATTERN);
const isoDate = z.string().datetime();

/**
 * Server-side contract for `POST /api/checkout`. The client builds the payload
 * from an already validated form; this re-checks every rule that matters for
 * fulfilment, since the request body is untrusted.
 */
export const orderPayloadSchema = z
  .object({
    orderId: z.string().refine(isOrderId, 'Invalid order id'),
    customer: z.object({
      firstName: name,
      lastName: name,
      phone: z.string(),
      email: text(100).email(),
    }),
    delivery: z.object({
      region: z.enum(deliveryRegions),
      method: z.enum(deliveryMethods),
      city: text(100).min(1),
      branchOrAddress: text(200).min(1),
      preferredTime: text(100).optional(),
      comment: text(500).optional(),
      country: text(100).optional(),
      postalCode: text(20).regex(POSTAL_CODE_PATTERN).optional(),
      billingAddress: text(200).optional(),
    }),
    payment: z.object({ method: z.enum(paymentMethods) }),
    items: z
      .array(
        z.object({
          id: z.string().min(1),
          productId: z.string().min(1),
          sku: z.string(),
          title: text(200).min(1),
          variant: text(200).optional(),
          price: z.number().nonnegative().finite(),
          quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
          image: z.string(),
        }),
      )
      .min(1)
      .max(MAX_ORDER_LINES),
    totals: z.object({
      subtotal: z.number().nonnegative().finite(),
      deliveryFee: z.number().nonnegative().finite(),
      grandTotal: z.number().nonnegative().finite(),
      currency: z.literal('UAH'),
    }),
    legal: z.object({ termsAgreed: z.literal(true), agreedAt: isoDate }),
    createdAt: isoDate,
  })
  .superRefine(({ customer, delivery, payment }, ctx) => {
    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: 'custom', path, message });

    const phoneIssue = getPhoneIssue(customer.phone, delivery.region);
    if (phoneIssue) {
      issue(['customer', 'phone'], phoneIssue);
    }

    const isUkraineMethod = (
      ukraineDeliveryMethods as readonly DeliveryMethod[]
    ).includes(delivery.method);
    if ((delivery.region === 'ua') !== isUkraineMethod) {
      issue(['delivery', 'method'], 'Method does not match region');
    }
    if (delivery.method === 'scheduled_courier' && !delivery.preferredTime) {
      issue(['delivery', 'preferredTime'], 'Required');
    }
    if (delivery.region === 'international') {
      if (!delivery.country) {
        issue(['delivery', 'country'], 'Required');
      }
      if (!delivery.postalCode) {
        issue(['delivery', 'postalCode'], 'Required');
      }
    }

    if (!isPaymentAvailable(payment.method, delivery.region)) {
      issue(['payment', 'method'], 'Unavailable for region');
    }
  });
