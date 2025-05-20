import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
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
        <Container>
          <Heading
            headingLevel="h2"
            variant="section"
            className="mb-10 text-center uppercase"
          >
            Product:
          </Heading>
          <ul className={`card-set-2/5 sm:card-set-${productTypes.length}`}>
            {productTypes.map(({ id, images: { url, alt }, title, slug }) => (
              <li
                key={id}
                className="card-set-item flex flex-col items-center justify-center gap-2"
              >
                <Link
                  href={slug}
                  className="bg-bg-secondary custom-transition inline-flex h-full w-full shrink-0 rounded-full p-6 transition hover:shadow-2xl"
                >
                  <Image
                    src={url}
                    alt={alt}
                    width={200}
                    height={200}
                    className="overflow-hidden object-cover"
                  />
                </Link>
                <Heading headingLevel="h3" variant="card">
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
