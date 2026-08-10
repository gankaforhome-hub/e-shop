import { type FC, type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
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
  className?: string;
}

export const ContentGridSection: FC<IContentGridSectionProps> = ({
  heading,
  text,
  firstImage,
  secondImage,
  aspect = 'aspect-343/300',
  action,
  className,
}) => {
  return (
    <Section className={cn('', className)}>
      <Container>
        <Heading headingLevel="h2" className="fmb-6/16 text-center">
          {heading}
        </Heading>

        <Box className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:gap-1">
          <ImageGridItem
            className="order-1 md:order-2"
            image={firstImage}
            aspect={aspect}
            items={2}
          />

          <Box
            className={cn(
              'max-md:bg-muted flex flex-col items-center justify-center rounded-lg p-6 max-md:min-h-80 max-md:py-10',
              'order-2',
              'md:order-1 md:col-span-2 md:p-0 md:pb-4',
            )}
          >
            {text}
          </Box>

          <ImageGridItem
            className="order-3 md:order-3"
            image={secondImage}
            aspect={aspect}
            items={2}
          />
        </Box>
        {action && <>{action}</>}
      </Container>
    </Section>
  );
};
