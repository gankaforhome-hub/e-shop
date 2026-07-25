import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

interface ISectionIntro {
  heading: string;
  description: string;
  headingId: string;
  headingLevel?: 'h1' | 'h2';
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
  className,
  textPosition,
  descriptionClassName,
}: ISectionIntro) {
  return (
    <>
      <Heading
        headingLevel={headingLevel}
        variant="section"
        className={cn('fmb-4/14 mx-auto text-center md:max-w-[80%]', className)}
        id={headingId}
      >
        {heading}
      </Heading>

      <Text
        font="secondary"
        className={cn(
          textPosition === 'center'
            ? 'md:max-w-[95%] md:text-balance md:text-center'
            : '',
          descriptionClassName,
        )}
      >
        {description}
      </Text>
    </>
  );
}
