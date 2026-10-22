import { type CartLine } from '@/entities/cart';
import {
  type OrderPayload,
  type OrderPayloadDelivery,
  type OrderPayloadItem,
  type OrderPayloadTotals,
} from '@/entities/order';

import {
  type CheckoutFormValues,
  isNovaPoshtaPointMethod,
  isStreetAddressMethod,
  toE164,
} from '../model/checkout.schema';

const optional = (value: string) => value || undefined;

const joinAddress = (...parts: string[]) => parts.filter(Boolean).join(', ');

function buildDelivery(values: CheckoutFormValues): OrderPayloadDelivery {
  const { deliveryMethod: method, region, city } = values;
  const base = { region, method, city, comment: optional(values.comment) };

  if (region === 'international') {
    return {
      ...base,
      branchOrAddress: values.address,
      country: values.country,
      postalCode: values.postalCode,
      billingAddress: values.billingSameAsShipping
        ? values.address
        : values.billingAddress,
    };
  }

  if (isNovaPoshtaPointMethod(method)) {
    return { ...base, branchOrAddress: values.npPoint };
  }

  if (isStreetAddressMethod(method)) {
    return {
      ...base,
      branchOrAddress: joinAddress(values.street, values.house, values.flat),
      preferredTime:
        method === 'scheduled_courier' ? values.preferredTime : undefined,
    };
  }

  return { ...base, branchOrAddress: '' };
}

export const toPayloadItem = (line: CartLine): OrderPayloadItem => ({
  id: line.id,
  productId: line.productId,
  sku: line.sku,
  title: line.title,
  variant: line.variantLabel,
  price: line.price.amount,
  quantity: line.quantity,
  image: line.image,
});

/** Shipping is billed by the carrier on delivery, so the shop charges no fee yet. */
const DELIVERY_FEE = 0;

/** Pure totals from payload items; the server recomputes them with this too. */
export function getOrderTotals(
  items: readonly Pick<OrderPayloadItem, 'price' | 'quantity'>[],
): OrderPayloadTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    subtotal,
    deliveryFee: DELIVERY_FEE,
    grandTotal: subtotal + DELIVERY_FEE,
    currency: 'UAH',
  };
}

interface BuildOrderPayloadParams {
  values: CheckoutFormValues;
  lines: readonly CartLine[];
  orderId: string;
  createdAt: Date;
}

/** Pure mapper: validated checkout form + cart lines → order request body. */
export function buildOrderPayload({
  values,
  lines,
  orderId,
  createdAt,
}: BuildOrderPayloadParams): OrderPayload {
  const items = lines.map(toPayloadItem);
  const timestamp = createdAt.toISOString();

  return {
    orderId,
    customer: {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: toE164(values.phone),
      email: values.email,
    },
    delivery: buildDelivery(values),
    payment: { method: values.paymentMethod },
    items,
    totals: getOrderTotals(items),
    // The form schema only validates with the box ticked, so submit time = agreement time
    legal: { termsAgreed: true, agreedAt: timestamp },
    createdAt: timestamp,
  };
}

const ORDER_ID_PATTERN = /^GFH-\d{6}-[A-Z0-9]{4}$/;

export const isOrderId = (value: unknown): value is string =>
  typeof value === 'string' && ORDER_ID_PATTERN.test(value);

/** Human-friendly order id, e.g. `GFH-261021-4K7Q`. */
export function createOrderId(date: Date, randomPart: string): string {
  const stamp = date.toISOString().slice(2, 10).replaceAll('-', '');
  return `GFH-${stamp}-${randomPart.slice(0, 4).toUpperCase()}`;
}
