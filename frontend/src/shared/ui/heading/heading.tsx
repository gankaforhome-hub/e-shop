import { cva, VariantProps } from 'class-variance-authority';
import { FC, HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export const headingVariants = cva('', {
  variants: {
    variant: {
      default: 'font-heading text-3xl font-bold tracking-wide',
      section: 'font-text text-2xl font-bold tracking-wide',
      card: 'font-text text-xl font-medium tracking-wide',
    },
    tone: {
      primary: 'text-fg',
      secondary: 'text-fg-secondary',
    },
    visibility: { hidden: 'visually-hidden', visible: 'block' },
  },

  defaultVariants: {
    variant: 'section',
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
