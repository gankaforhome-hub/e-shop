import { FC } from 'react';

import rawJson from '@/dictionary/index.json';
import { cn } from '@/shared/lib/utils';
import { IndexPage } from '@/shared/types/dictionary/index-page';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

const index = rawJson as IndexPage;
const featuresSection = index.featuresSection;

interface IFeaturesProps {
  data?: typeof featuresSection;
}

export const Features: FC<IFeaturesProps> = () => {
  const { features, sectionTitle } = featuresSection;

  return (
    <>
      <Section className="py-12">
        <Container>
          <Heading headingLevel="h2" className="visually-hidden">
            {sectionTitle}
          </Heading>
          <ul className="fgap-3/5 grid w-full grid-cols-1 lg:grid-cols-3">
            {features.map(({ icon, title, description }) => (
              <li
                key={icon}
                className={cn(
                  'border-border-muted fpy-6/9 flex flex-col items-center justify-center gap-5 border px-7',
                  'min-lg:flex-col max-2xl:flex-col 2xl:flex-row',
                )}
              >
                <Text
                  as="span"
                  className="bg-bg-accent flex size-11 items-center justify-center rounded-full"
                >
                  <Icon name={icon} className="h-6 w-6" />
                </Text>
                <Box className="flex-1">
                  <Heading
                    headingLevel="h3"
                    className="text-lg max-lg:text-center"
                  >
                    {title}
                  </Heading>
                  <Text>{description}</Text>
                </Box>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
};
