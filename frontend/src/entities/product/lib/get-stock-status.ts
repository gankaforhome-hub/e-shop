import { type ProductStock, type ProductStockStatus } from '../model/types';

export function getStockStatus(stock: ProductStock): ProductStockStatus {
  const threshold = stock.lowStockThreshold ?? 2;

  if (stock.quantity <= 0) {
    return stock.allowBackorder ? 'pre_order' : 'out_of_stock';
  }

  if (stock.quantity <= threshold) {
    return 'low_stock';
  }

  return 'in_stock';
}
