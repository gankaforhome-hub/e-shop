import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

import type { AboutHeroContent } from '../api';

export function AboutHeroSection({ heading, paragraph }: AboutHeroContent) {
  return (
    <>
      <Section className="fpt-10/14 fpb-10/30">
        <Container>
          <Heading headingLevel="h2" variant="section" position="center">
            {heading}
          </Heading>
          <Text position="center" className="fmt-4/14" font="secondary">
            {paragraph}
          </Text>
        </Container>
      </Section>
    </>
  );
}
