import { cva, VariantProps } from 'class-variance-authority';
import { FC, HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export const headingVariants = cva('font-text font-normal tracking-normal', {
  variants: {
    variant: {
      pageHeader: 'ftext-6/12 fleading-8/14',
      section: 'ftext-6/12 fleading-8/14',
      productItem: 'ftext-6/8 fleading-8/9',
      productCard: 'ftext-4/5 fleading-6/7',
    },
    tone: {
      primary: 'text-header',
    },
    visibility: { hidden: 'sr-only', visible: 'block' },
  },

  defaultVariants: {
    variant: 'pageHeader',
    tone: 'primary',
    visibility: 'visible',
  },
  compoundVariants: [],
});

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
  visibility,
  className,
  ...props
}) => {
  const Head = headingLevel;

  return (
    <>
      <Head
        className={cn(
          headingVariants({ visibility, tone, variant, className }),
        )}
        {...props}
      >
        {children}
      </Head>
    </>
  );
};
