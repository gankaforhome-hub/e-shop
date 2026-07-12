import Image from 'next/image';
import { FC } from 'react';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

import { productTypes } from '../config/product-types-data';

interface IProductTypesProps {
  className?: string;
}

export const ProductTypes: FC<IProductTypesProps> = ({ className }) => {
  return (
    <>
      <Section className={cn('py-20', className)}>
        <Container className="items-center xl:flex xl:justify-between">
          <Heading
            headingLevel="h2"
            variant="section"
            className="mx-auto mb-10 flex-1 text-center uppercase"
          >
            Product:
          </Heading>
          <ul
            className={`card-set-2/5 sm:card-set-${productTypes.length} sm:flex-nowrap`}
          >
            {productTypes.map(({ id, images: { url, alt }, title, slug }) => (
              <li
                key={id}
                className="card-set-item flex flex-col items-center justify-center gap-2"
              >
                <AppLink
                  href={routes.products}
                  className="max-h:40 max-w:40 bg-bg-secondary custom-transition flex shrink-0 overflow-hidden rounded-full p-6 transition hover:shadow-2xl"
                >
                  <Image
                    src={url}
                    alt={alt}
                    width={150}
                    height={150}
                    className="object-cover"
                  />
                </AppLink>
                <Heading headingLevel="h3" variant="cardItem">
                  {title}
                </Heading>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
};
