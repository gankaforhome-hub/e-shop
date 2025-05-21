// entities/productCard/ui/ProductCard.tsx

import { FC, ReactNode } from 'react';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { Product } from '../model/types';

interface IProductCardProps {
  className: string;
  product: Product;
  mediaData: ReactNode;
  onAddToBag: () => void;
  onAddFavorite: () => void;
  showPrice?: boolean;
  showRating?: boolean;
  showVariants?: boolean;
  addToBag: string;
}

export const ProductCard: FC<IProductCardProps> = ({
  className,
  product,
  addToBag,
  onAddFavorite,
  onAddToBag,
  mediaData,
}) => {
  return (
    <Box className={cn('flex flex-col', className)}>
      <Box className="bg-bg-secondary min-h-75 pointer-events-auto relative flex items-center justify-center p-6">
        {mediaData}
        <Text
          as="span"
          className="bg-bg leading-0 absolute left-3 top-3 z-10 inline-flex items-center justify-center px-2.5 py-1 text-xs capitalize tracking-wide"
        >
          {product.tags}
        </Text>

        <Button
          variant="icon"
          size="icon"
          onClick={onAddFavorite}
          className="absolute right-3 top-3 z-10"
        >
          <Icon name="favorite" className="size-4 align-middle" />
        </Button>
      </Box>
      <AppLink
        href={routes.product(product.slug)}
        className="custom-transition flex w-full grow flex-col px-2 pb-3 pt-5 transition-opacity hover:opacity-80"
      >
        <Heading headingLevel="h3" variant="card">
          {product.title}
        </Heading>
        <Text className="opacity-65">{product.description}</Text>
      </AppLink>
      <Button
        onClick={onAddToBag}
        variant="secondary"
        className="flex w-full items-center justify-between"
      >
        <Text as="span" variant="inherit">
          {product.currency}
          {product.price}
        </Text>
        <Text as="span" variant="inherit">
          {addToBag}
        </Text>
      </Button>
    </Box>
  );
};
