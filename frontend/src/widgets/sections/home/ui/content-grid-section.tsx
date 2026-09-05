import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import {
  type IImageGridItemProps,
  ImageGridItem,
} from '@/shared/ui/image-grid-item';
import { Section } from '@/shared/ui/section';

interface IContentGridSectionProps {
  heading: string;
  text?: ReactNode;
  firstImage: IImageGridItemProps['image'];
  secondImage: IImageGridItemProps['image'];
  aspect?: string;
  action?: ReactNode;
  ariaLabelledbySection?: string;
  className?: string;
}

export function ContentGridSection({
  heading,
  text,
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
        <Heading
          id={ariaLabelledbySection}
          headingLevel="h2"
          variant="section"
          position="center"
        >
          {heading}
        </Heading>

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
              'md:order-1 md:col-span-2 md:p-0 md:pb-4',
            )}
          >
            {text}
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
