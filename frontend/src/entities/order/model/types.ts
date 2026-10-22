import { type CartLine } from '@/entities/cart';
import { type ProductPrice } from '@/entities/product';

export type OrderStatus =
  'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type OrderCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type OrderShipping = {
  method: 'nova_poshta' | 'courier' | 'pickup';
  city: string;
  address: string;
};

/** Order snapshot: lines copy price/title at checkout time, independent of later catalog edits. */
export type Order = {
  id: string;
  number: string;
  status: OrderStatus;
  lines: CartLine[];
  subtotal: ProductPrice;
  shippingCost: ProductPrice;
  total: ProductPrice;
  customer: OrderCustomer;
  shipping: OrderShipping;
  comment?: string;
  createdAt: string;
};

// -------------------------------------------------------------
// Checkout payload (sent by the storefront before payment)
// -------------------------------------------------------------

export const deliveryRegions = ['ua', 'international'] as const;
export type DeliveryRegion = (typeof deliveryRegions)[number];

export const ukraineDeliveryMethods = [
  'nova_poshta_branch',
  'nova_poshta_locker',
  'nova_poshta_courier',
  'scheduled_courier',
] as const;
export const deliveryMethods = [
  ...ukraineDeliveryMethods,
  'international',
] as const;
export type DeliveryMethod = (typeof deliveryMethods)[number];

export const paymentMethods = ['liqpay', 'card', 'cod'] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

/** Cash on delivery is a Nova Poshta service, unavailable abroad. */
export const isPaymentAvailable = (
  method: PaymentMethod,
  region: DeliveryRegion,
): boolean => method !== 'cod' || region === 'ua';

export type OrderPayloadDelivery = {
  region: DeliveryRegion;
  method: DeliveryMethod;
  city: string;
  /** Nova Poshta branch/locker label or a full street address. */
  branchOrAddress: string;
  /** Scheduled courier only. */
  preferredTime?: string;
  comment?: string;
  /** International only. */
  country?: string;
  postalCode?: string;
  billingAddress?: string;
};

export type OrderPayloadItem = {
  /** Cart line id (= variant id). */
  id: string;
  productId: string;
  sku: string;
  title: string;
  /** Variant label, e.g. "22 cm · Forest green". */
  variant?: string;
  /** UAH per unit. */
  price: number;
  quantity: number;
  /** Thumbnail URL snapshot (confirmation screen, order e-mails). */
  image: string;
};

export type OrderPayloadTotals = {
  subtotal: number;
  /** Charged by the shop; 0 while the carrier bills shipping on delivery. */
  deliveryFee: number;
  grandTotal: number;
  currency: 'UAH';
};

/** Order request built at checkout and POSTed to `/api/checkout`. */
export type OrderPayload = {
  orderId: string;
  customer: OrderCustomer;
  delivery: OrderPayloadDelivery;
  payment: { method: PaymentMethod };
  items: OrderPayloadItem[];
  totals: OrderPayloadTotals;
  legal: { termsAgreed: true; agreedAt: string };
  createdAt: string;
};
