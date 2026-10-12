import { type HTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

export const headingVariants = cva(
  'font-heading text-balance font-normal tracking-normal',
  {
    variants: {
      variant: {
        pageHeader:
          'xl:leading-14 text-2xl tracking-wide md:text-3xl xl:text-5xl',
        section: 'xl:leading-14 text-2xl tracking-wide md:text-3xl xl:text-5xl',
        footer: 'text-xl uppercase tracking-wide lg:text-2xl',
        collectionCard: 'text-base md:text-lg lg:text-2xl',
        productCard: 'ftext-4 fleading-7',
        productPage: 'text-wrap text-2xl lg:text-3xl',
        textPanel:
          'xl:leading-14 text-2xl tracking-wide md:text-3xl xl:text-5xl',
        none: '',
      },
      tone: {
        primary: 'text-foreground',
        accent: 'text-accent-foreground',
      },
      position: {
        left: 'text-left',
        // Horizontal centering (mx-auto) is owned by the call site
        center: 'max-w-[80%] text-center',
      },
      visibility: { hidden: 'sr-only' },
    },

    defaultVariants: {
      variant: 'pageHeader',
      tone: 'primary',
    },
    compoundVariants: [],
  },
);

interface IHeadingProps
  extends
    HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function Heading({
  headingLevel = 'h1',
  children,
  variant,
  tone,
  position,
  visibility,
  className,
  ...props
}: IHeadingProps) {
  const Head = headingLevel;

  return (
    <>
      <Head
        className={cn(
          headingVariants({ visibility, tone, variant, position, className }),
        )}
        {...props}
      >
        {children}
      </Head>
    </>
  );
}
