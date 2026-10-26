import {
  SectionHeader,
  type SectionHeaderProps,
} from '@/shared/ui/section-header';

interface ISectionIntroProps {
  heading: string;
  description: string;
  headingId: string;
  headingLevel?: 'h1' | 'h2';
  headingVisible?: boolean;
  /** `display` = Playfair, for collection names only. */
  headingFont?: 'display';
  /** `fromMd` inside a mobile card; `none` when nothing follows the intro. */
  spacing?: SectionHeaderProps['spacing'];
  /** Heading only (e.g. tracking); the intro owns width and alignment. */
  className?: string;
  /** Layout only: margins/order of the intro block inside its parent. */
  wrapperClassName?: string;
}

/**
 * Section intro on the shared `SectionHeader` layout (the contacts "Still have
 * questions?" block): heading visually hidden by default, description in body
 * ink, followed by the section's standard gap to the next block.
 */
export function SectionIntro({
  heading,
  description,
  headingId,
  headingLevel = 'h2',
  headingVisible = false,
  headingFont,
  spacing = 'default',
  className,
  wrapperClassName,
}: ISectionIntroProps) {
  return (
    <SectionHeader
      heading={heading}
      headingId={headingId}
      headingLevel={headingLevel}
      headingVisible={headingVisible}
      headingFont={headingFont}
      headingClassName={className}
      description={description}
      descriptionTone="default"
      spacing={spacing}
      className={wrapperClassName}
    />
  );
}
