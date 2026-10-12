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
