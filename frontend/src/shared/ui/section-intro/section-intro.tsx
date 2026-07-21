import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

interface ISectionIntro {
  heading: string;
  description: string;
  headingId: string;
  className?: string;
  descriptionClassName?: string;
  children?: ReactNode;
}

export function SectionIntro({
  heading,
  description,
  headingId,
  className,
  descriptionClassName,
}: ISectionIntro) {
  return (
    <>
      <Heading
        headingLevel="h2"
        variant="section"
        className={cn('fmb-4/6 mx-auto text-center md:max-w-[80%]', className)}
        id={headingId}
      >
        {heading}
      </Heading>

      <Text
        font="secondary"
        className={cn(
          'md:max-w-[95%] md:text-balance md:text-center',
          descriptionClassName,
        )}
      >
        {description}
      </Text>
    </>
  );
}
