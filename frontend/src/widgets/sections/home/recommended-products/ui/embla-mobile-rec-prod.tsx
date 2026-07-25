'use client';

import { ProductCard } from '@/entities/product';
import { type ProductCardDTO } from '@/entities/product/model/types';
import { FavoriteButton } from '@/features/add-to-favorite';
import { GallerySlider } from '@/shared/ui/carousel';

interface IMobileRecommendedProducts {
  products: ProductCardDTO[];
}

export function MobileRecommendedProducts({
  products,
}: IMobileRecommendedProducts) {
  return (
    <GallerySlider
      opts={{
        align: 'center',
      }}
      items={products}
      renderItem={product => (
        <ProductCard
          className="rounded-0"
          product={product}
          favoriteButton={
            <FavoriteButton
              productId={product.id}
              initialFavorite={product.isFavorite}
            />
          }
        />
      )}
    />
  );
}
