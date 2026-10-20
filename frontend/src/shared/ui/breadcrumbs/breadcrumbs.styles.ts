import { cva, type VariantProps } from 'class-variance-authority';

/** Shared by the trail and its skeleton so the shell never shifts. */
export const breadcrumbsContainerVariants = cva('', {
  variants: {
    spacing: {
      default: 'pb-4 pt-2 md:pb-8 md:pt-4 xl:pb-16 xl:pt-8',
      /** Before an editorial `Section` (which brings its own 32 → 56px top):
       *  fluid 8 → 32px above, 0 → 8px below. */
      editorial: 'fpt-2/8 fpb-0/2',
    },
  },
  defaultVariants: { spacing: 'default' },
});

export type BreadcrumbsSpacing = VariantProps<
  typeof breadcrumbsContainerVariants
>['spacing'];
