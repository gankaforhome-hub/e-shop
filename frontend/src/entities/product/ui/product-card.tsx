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
  hideDesc?: boolean;
  hideTitle?: boolean;
}

export const ProductCard: FC<IProductCardProps> = ({
  className,
  product,
  addToBag,
  onAddFavorite,
  onAddToBag,
  mediaData,
  hideDesc,
  hideTitle,
}) => {
  return (
    <article
      className={cn(
        'relative flex flex-col items-center justify-center transition-all duration-500',
        'group-hover:z-100 group-hover:bg-bg group-hover:scale-105',
        'group-hover:rounded-2xl group-hover:shadow-2xl xl:py-5',
        '',
        className,
      )}
    >
      <Box
        className={cn(
          'relative z-10 flex flex-col items-center justify-center p-10 transition-transform duration-500 max-lg:flex-1 xl:p-0',
          'bg-bg-secondary lg:flex-0',
          hideDesc ? `-translate-y-10 group-hover:-translate-y-0` : '',
          'xl:group-hover:scale-80',
          hideTitle && '-translate-y-5 group-hover:translate-y-0',
        )}
      >
        <Box className={cn('bg-bg-secondary')}>
          {mediaData}
          <Text
            as="span"
            className={cn(
              'bg-bg leading-0 absolute left-3 top-3 z-50 px-2.5 py-1 text-sm capitalize tracking-wide',
            )}
          >
            {product.tags}
          </Text>

          <Button
            variant="icon"
            size="icon"
            onClick={onAddFavorite}
            className="absolute right-3 top-3 z-50"
          >
            <Icon name="favorite" className="size-5 fill-none" />
          </Button>
        </Box>
      </Box>

      <Box
        className={cn(
          'relative flex flex-1 flex-col items-center justify-center transition-all duration-300 max-xl:pt-8',
          hideDesc
            ? `flex-0 flex h-0 opacity-0 group-hover:flex-1 group-hover:opacity-100`
            : '',
          'xl:px-[10%]',
          hideTitle &&
            'xl:-translate-y-10 xl:flex-col-reverse xl:opacity-100 xl:group-hover:translate-y-0 xl:group-hover:flex-col',
          'h-full w-full',
        )}
      >
        <Heading
          headingLevel="h3"
          variant="card"
          className={cn(
            'custom-transition relative text-start transition-opacity',
            hideTitle &&
              'mx-auto group-hover:mx-0 group-hover:mr-auto xl:opacity-100',
          )}
        >
          <AppLink href={routes.product(product.slug)}>{product.title}</AppLink>
        </Heading>

        {/* <AppLink
          href={routes.product(product.slug)}
          className={cn(sAppLink, 'h-full shrink')}
        > */}
        <Text
          className={cn(
            'mb-6 mt-4 opacity-65 transition-all duration-500',
            'line-clamp-2 h-full w-full shrink text-ellipsis',
          )}
        >
          {product.description}
        </Text>
        {/* </AppLink> */}

        <Button
          onClick={onAddToBag}
          variant="secondary"
          className={cn(
            'relative mt-auto flex w-full items-center justify-between',
          )}
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
    </article>
  );
};
