export {
  getLocalizedProducts,
  getProductBySlug,
  getProducts,
  type GetProductsParams,
  type PaginatedProductsDTO,
} from './api/get-products';
export { getMainVariant, resolveSelectedVariant } from './lib/product-mapper';
export { buildSku, type BuildSkuParams } from './lib/sku';
export { type ProductCardDTO } from './model/product-card.dto';
export {
  type LocalizedProduct,
  type Product,
  type ProductMedia,
  type ProductPrice,
  type ProductTranslation,
  type ProductVariant,
  type ProductVariantTranslation,
  type TProduct,
} from './model/types';
export { ProductCard } from './ui/product-card/product-card';
export { ProductCardSkeleton } from './ui/product-card/product-card-skeleton';
export { ProductDetailView } from './ui/product-detail-view/product-detail-view';
