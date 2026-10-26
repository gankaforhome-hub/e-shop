import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';
import {
  type IImageGridItemProps,
  ImageGridItem,
} from '@/shared/ui/image-grid-item';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

interface IContentGridSectionProps {
  heading: string;
  description: string;
  firstImage: IImageGridItemProps['image'];
  secondImage: IImageGridItemProps['image'];
  aspect?: string;
  action?: ReactNode;
  ariaLabelledbySection: string;
  className?: string;
}

export function ContentGridSection({
  heading,
  description,
  firstImage,
  secondImage,
  aspect = 'aspect-343/300',
  action,
  ariaLabelledbySection,
  className,
}: IContentGridSectionProps) {
  return (
    <Section className={cn(className)} aria-labelledby={ariaLabelledbySection}>
      <Container>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:gap-1">
          <ImageGridItem
            className="order-1 md:order-2"
            image={firstImage}
            aspect={aspect}
            items={2}
          />

          <div
            className={cn(
              'max-md:bg-muted flex flex-col items-center justify-center p-6 max-md:min-h-80 max-md:py-10',
              'order-2',
              'md:order-1 md:col-span-2 md:p-0',
            )}
          >
            {/* Heading stays visually hidden; below md the intro is the
                muted card between the two images */}
            <SectionIntro
              headingId={ariaLabelledbySection}
              heading={heading}
              description={description}
              spacing="fromMd"
            />
          </div>

          <ImageGridItem
            className="order-3 md:order-3"
            image={secondImage}
            aspect={aspect}
            items={2}
          />
        </div>
        {action && <>{action}</>}
      </Container>
    </Section>
  );
}
