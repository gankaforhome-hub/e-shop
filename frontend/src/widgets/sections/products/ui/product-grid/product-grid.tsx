import { ProductCard } from '@/entities/product';
import { type ProductCardDTO } from '@/entities/product/model/types';
import { FavoriteButton } from '@/features/add-to-favorite';

interface IProductGrid {
  products: ProductCardDTO[];
  limit?: number;
  className?: string;
}

export const ProductGrid = ({
  products,
  limit,
  className = '',
}: IProductGrid) => {
  const visibleProducts = limit ? products.slice(0, limit) : products;

  if (!visibleProducts.length) {
    return null;
  }

  return (
    <ul
      className={`grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {visibleProducts.map(product => (
        <li key={product.id}>
          <ProductCard
            product={product}
            favoriteButton={
              <FavoriteButton
                productId={product.id}
                initialFavorite={product.isFavorite}
              />
            }
          ></ProductCard>
        </li>
      ))}
    </ul>
  );
};
