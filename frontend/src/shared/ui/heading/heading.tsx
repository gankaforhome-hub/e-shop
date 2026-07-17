import { cva, type VariantProps } from 'class-variance-authority';
import { type FC, type HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export const headingVariants = cva(
  'font-heading text-balance font-normal tracking-normal',
  {
    variants: {
      variant: {
        pageHeader: 'ftext-6/12 fleading-8/14',
        section: 'ftext-6/12 fleading-8/14 tracking-wider',
        cardItem: 'ftext-6/8 fleading-8/9',
        productCard: 'ftext-4 fleading-7',
        footer:
          'font-heading text-fg-accent text-xl uppercase tracking-wider lg:text-2xl',
      },
      tone: {
        primary: 'text-header',
        accent: 'text-fg-accent',
      },
      position: { center: 'mx-auto max-w-[80%] text-center' },
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

export const Heading: FC<IHeadingProps> = ({
  headingLevel = 'h1',
  children,
  variant,
  tone,
  position,
  visibility,
  className,
  ...props
}) => {
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
};
