import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

interface ISectionIntroProps {
  heading: string;
  description: string;
  headingId: string;
  headingLevel?: 'h1' | 'h2';
  headingVisible?: boolean;
  className?: string;
  textPosition?: 'center';
  descriptionClassName?: string;
  children?: ReactNode;
}

export function SectionIntro({
  heading,
  description,
  headingId,
  headingLevel = 'h2',
  headingVisible,
  className,
  textPosition,
  descriptionClassName,
}: ISectionIntroProps) {
  return (
    <>
      <Heading
        headingLevel={headingLevel}
        variant="section"
        position="center"
        className={cn('mx-auto text-balance md:max-w-[80%]', className)}
        visibility={headingVisible ? null : 'hidden'}
        id={headingId}
      >
        {heading}
      </Heading>

      <Text
        className={cn(
          'mx-auto px-4 md:max-w-[95%] lg:max-w-full',
          textPosition === 'center' ? 'md:text-balance md:text-center' : '',
          descriptionClassName,
        )}
      >
        {description}
      </Text>
    </>
  );
}
