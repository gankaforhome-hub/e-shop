export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}
