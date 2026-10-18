import { type HTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

export const headingVariants = cva('text-balance font-normal tracking-normal', {
  variants: {
    variant: {
      pageHeader:
        'xl:leading-14 text-2xl tracking-wide md:text-3xl xl:text-5xl',
      section: 'xl:leading-14 text-2xl tracking-wide md:text-3xl xl:text-5xl',
      footer: 'text-xl uppercase tracking-wide lg:text-2xl',
      collectionCard: 'text-base md:text-lg lg:text-2xl',
      productCard: 'ftext-4 fleading-7',
      productPage: 'text-wrap text-2xl lg:text-3xl',
      textPanel: 'xl:leading-14 text-2xl tracking-wide md:text-3xl xl:text-5xl',
      /** Long-form documents (info/legal pages): 24 → 30px page title. */
      document: 'text-2xl leading-tight tracking-wide md:text-3xl',
      /** Long-form section titles: 18 → 20px. */
      subsection: 'text-lg leading-snug tracking-wide md:text-xl',
      /** Long-form sub-titles and callout titles: 16 → 18px. */
      minor: 'text-base leading-snug tracking-wide md:text-lg',
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
    /** Playfair (`font-display`): collection names only — card titles and the
     *  collection page `h1`. Everything else inherits Noto. */
    font: { display: 'font-display' },
  },

  defaultVariants: {
    variant: 'pageHeader',
    tone: 'primary',
  },
  compoundVariants: [],
});

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
  font,
  className,
  ...props
}: IHeadingProps) {
  const Head = headingLevel;

  return (
    <>
      <Head
        className={cn(
          headingVariants({
            visibility,
            tone,
            variant,
            position,
            font,
            className,
          }),
        )}
        {...props}
      >
        {children}
      </Head>
    </>
  );
}
