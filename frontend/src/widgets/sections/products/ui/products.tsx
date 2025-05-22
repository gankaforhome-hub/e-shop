'use client';
import { FC } from 'react';

import { ProductCard } from '@/entities/product';
import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

import { products } from '../config/products-data';

import { ProductsMedia } from './products-media';
import { ProductsPagination } from './products-pagination';

interface IProductsProps {
  className?: string;
}

export const Products: FC<IProductsProps> = ({ className }) => {
  const addToBag = 'Add to Bag';
  const onAddToBag = () => {
    console.log('add to bag');
  };
  const onAddFavorite = () => {
    console.log('add favorite');
  };
  return (
    <>
      <Section className={cn('py-5', className)}>
        <Container>
          <Heading headingLevel="h2" visibility="hidden">
            Ganka for home products
          </Heading>
          <Carousel isOpacityTween opts={{ loop: true }}>
            <CarouselContent className="ml-[-0.5rem] touch-pan-y gap-2">
              {products.map(product => (
                <CarouselItem
                  key={product.id}
                  className="min-w-0 basis-[75%] transform-gpu pl-4"
                >
                  <ProductCard
                    mediaData={
                      <ProductsMedia
                        media={product.media}
                        slug={product.slug}
                      />
                    }
                    addToBag={addToBag}
                    onAddToBag={onAddToBag}
                    onAddFavorite={onAddFavorite}
                    product={product}
                    className="h-full"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <Box className="mb-10 mt-5 flex items-center justify-center gap-4">
              {products.map((_, idx) => (
                <ProductsPagination key={idx} to={idx} />
              ))}
            </Box>
          </Carousel>
          <Button asChild border="border" className="max-sm:w-full">
            <AppLink href={routes.categories}>Go to Catalog</AppLink>
          </Button>
        </Container>
      </Section>
    </>
  );
};
