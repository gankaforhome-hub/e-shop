'use client';
import { ProductCard } from '@/entities/product';
import { type ProductCardDTO } from '@/entities/product/model/types';
import { FavoriteButton } from '@/features/add-to-favorite';
import { cn } from '@/shared/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselProgressBar,
} from '@/shared/ui/carousel';

0;

interface IGallerySlider {
  products: ProductCardDTO[];
  limit?: number;
  className?: string;
  paginationPlacement?: 'top' | 'bottom' | 'none';
}

export function MobProductGrid({
  products,
  className,
  limit,
  paginationPlacement = 'bottom',
}: IGallerySlider) {
  return (
    <Carousel
      opts={{
        duration: 100,
        align: 'start',
      }}
      // isOpacityTween
      className={cn('w-full', className)}
    >
      <CarouselContent className="relative sm:-mx-1">
        {products.map((product, index) => (
          <CarouselItem
            key={index}
            className={cn('basis-full px-1 sm:basis-2/3 sm:pl-5')}
          >
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
          </CarouselItem>
        ))}
      </CarouselContent>
      {paginationPlacement === 'bottom' && (
        <CarouselProgressBar totalSlides={products.length} />
      )}
    </Carousel>
  );
}
