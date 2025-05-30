import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

import { contactLinks } from '../config/not-found.data';

interface INotFoundWidgetProps {
  className?: string;
}

const t = {
  ImageAlt: 'clay plate',
  PageNotFound: 'page not found',
  Description:
    'We cannot find the page you were looking for. Please check the URL or navigate to another page. We apologize for inconvenience.',
  CanWeHelp: 'Can we help you?',
};

export const NotFoundWidget: FC<INotFoundWidgetProps> = () => {
  return (
    <Section className="fpt-18/38 fpb-13/25">
      <Container className="flex flex-col items-center justify-center">
        <Box
          className={cn(
            'fw-80/100 fmb-22/30 relative flex items-center justify-between',
            "before:fh-50/63 before:fw-50/63 before:absolute before:left-1/2 before:z-0 before:-translate-x-8 before:overflow-hidden before:rounded-full before:bg-[url('/images/pages/not-found/plate.webp')] before:bg-cover before:bg-center before:content-['']",
            'before:-translate-x-1/2',
          )}
        >
          <Icon name="four" className="fh-30/38 fw-20/25 fill-icon shrink-0" />
          <Icon
            name="four"
            className="fh-30/38 fw-20/25 fill-icon z-10 shrink-0"
          />
        </Box>
        <Box className="border-b-1 fpb-13/16 fmb-10/13">
          <Heading
            headingLevel="h1"
            className="fmb-6/7.5 ftext-6/8 text-center uppercase"
          >
            {t.PageNotFound}
          </Heading>
          <Text className="max-w-181 font-text ftext-4/4.5 text-center leading-[1.5]">
            {t.Description}
          </Text>
        </Box>
        <Text className="ftext-4/5 fmb-9/11 text-center">{t.CanWeHelp}</Text>
        <Box className="flex flex-col items-center justify-center">
          <ul
            className={cn(
              'fgap-2/5 max-[22.5rem]:grid-cols-1 grid grid-cols-2',
            )}
          >
            {contactLinks.map(({ href, label, icon }) => (
              <li key={href} className="group">
                <Button size={'link'} variant="link" asChild>
                  <AppLink
                    href={href}
                    className="fpy-4/5 fw-40/63 fill-none px-1 capitalize"
                  >
                    <Icon
                      name={icon}
                      className="group-hover:stroke-fg-accent -order-1 h-6 w-6"
                    >
                      {label}
                    </Icon>
                  </AppLink>
                </Button>
              </li>
            ))}
          </ul>
        </Box>
        {/* //TODO add button move to collection */}
      </Container>
    </Section>
  );
};
