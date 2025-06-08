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
      <Section className={cn('fpt-5/10 fpb-8/10', className)}>
        <Container>
          <Heading headingLevel="h2" visibility="hidden">
            Ganka for home products
          </Heading>
          <Carousel className="xl:hidden" opts={{ inViewThreshold: 0.01 }}>
            <CarouselContent className="gap-4">
              {products.map(product => (
                <CarouselItem key={product.id} className="basis-75">
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
            <Box className="mb-10 mt-10 flex items-center justify-center gap-4">
              {products.map((_, idx) => (
                <ProductsPagination key={idx} to={idx} />
              ))}
            </Box>
          </Carousel>
          <ul
            className={cn(
              'xl:mb-30 xl:gap:10 mx-auto hidden',
              'gap-5 xl:grid xl:grid-cols-4',
              // 'lg:card-set-4/5',
            )}
          >
            {products.map(product => (
              <li key={product.id} className="group">
                <ProductCard
                  mediaData={
                    <ProductsMedia media={product.media} slug={product.slug} />
                  }
                  addToBag={addToBag}
                  onAddToBag={onAddToBag}
                  onAddFavorite={onAddFavorite}
                  product={product}
                  className="h-full"
                  hideDesc={true}
                  hideTitle={true}
                />
              </li>
            ))}
          </ul>
          <Button
            asChild
            border="border"
            className="max-sm:w-full sm:mx-auto sm:flex sm:max-w-40"
          >
            <AppLink href={routes.products}>Go to Catalog</AppLink>
          </Button>
        </Container>
      </Section>
    </>
  );
};
