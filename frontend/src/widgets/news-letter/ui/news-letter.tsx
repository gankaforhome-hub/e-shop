import { type FC } from 'react';

import rawJson from '@/dictionary/index.json';
import { SubscribeForm } from '@/features/subscribe-form';
import { cn } from '@/shared/lib/utils';
import { type IndexPage } from '@/shared/types/dictionary/index-page';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

const index = rawJson as IndexPage;
const newsLetterSection = index.newsLetterSection;

interface INewsLetterProps {
  data?: typeof newsLetterSection;
}

export const NewsLetter: FC<INewsLetterProps> = () => {
  const { form, description, sectionTitle } = newsLetterSection;

  return (
    <>
      <Section className="">
        <Container>
          <Box className="bg-bg-accent grid grid-cols-1 lg:grid-cols-2">
            <Box className="fp-8/13">
              <Heading
                headingLevel="h2"
                className="fmb-5/6 capitalize leading-[1.1]"
              >
                {sectionTitle}
              </Heading>
              <Text className="max-w-112.5 w-full first-letter:uppercase">
                {description}
              </Text>
              <SubscribeForm form={form} />
            </Box>
            <Box
              className={cn(
                "h-100 max-h-full w-full overflow-hidden bg-[url('/images/pages/home/news-letter-bg_mob.webp')] object-cover object-center sm:bg-[url('/images/pages/home/news-letter-bg_tab.webp')]",
                'flex items-center justify-center',
              )}
            >
              <Text
                as="span"
                className="bg-bg fw-40/60 fh-12/16 fpx-5/6 flex items-center justify-center"
              >
                <Icon name="logo" className="flex h-5/6 w-auto flex-1" />
              </Text>
              {/* <Logo className="fp-5/6 bg-bg disable" /> */}
            </Box>
          </Box>
        </Container>
      </Section>
    </>
  );
};
