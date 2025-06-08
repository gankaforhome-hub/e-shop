import { FC } from 'react';

import rawJson from '@/dictionary/common.json';
import { cn } from '@/shared/lib/utils';
import { CommonPage } from '@/shared/types/dictionary/common';
import { Accordion } from '@/shared/ui/accordion';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';
import { Text } from '@/shared/ui/text';

import { AccordionFooter } from './accordion-footer';
import { FooterSection } from './footer-section';
import { UnderFooter } from './under-footer';

const common = rawJson as CommonPage;
const footer = common.footer;

interface IFooterProps {
  data?: typeof footer;
}

export const Footer: FC<IFooterProps> = () => {
  const { underFooter, nav, customerService, contacts, social, payments } =
    footer;

  const sHeading = 'uppercase fmb-4/6';
  const sNav = 'fgap-2/6 flex flex-col';
  return (
    <footer>
      <Separator variant="accent" size="md" />
      <Container className="fpt-15/20">
        <Box
          className={cn(
            'fgap-5/7 fmb-5/7',
            'flex flex-col md:flex-row md:justify-between',
          )}
        >
          <Accordion className="md:hidden" type="single" collapsible>
            <AccordionFooter
              item={'item-1'}
              heading={contacts.title}
              content={
                <>
                  <Text className="fmb-2/6 text-balance">
                    {contacts.description}
                  </Text>
                  <FooterSection
                    className={cn(sNav)}
                    type="contacts"
                    items={contacts.navContacts}
                  />
                </>
              }
            />
            <AccordionFooter
              item={'item-2'}
              heading={nav.title}
              content={
                <>
                  <FooterSection
                    className={sNav}
                    type="nav"
                    items={nav.navMenu}
                  />
                </>
              }
            />

            <AccordionFooter
              item={'item-3'}
              heading={customerService.title}
              content={
                <>
                  <FooterSection
                    className={sNav}
                    type="customerService"
                    items={customerService.navCustomerService}
                  />
                </>
              }
            />
            <AccordionFooter
              item={'item-4'}
              heading={social.title}
              content={
                <>
                  <FooterSection
                    className="fgap-3/4 flex flex-col"
                    type="social"
                    items={social.socialLink}
                  />
                </>
              }
            />
          </Accordion>

          <Box className={cn('flex-0 max-md:hidden')}>
            <Heading
              headingLevel="h3"
              variant="card"
              className="fmb-4/6 uppercase"
            >
              {contacts.title}
            </Heading>
            <Text className="fmb-2/6 text-balance">{contacts.description}</Text>
            <FooterSection
              className={cn('flex-0', sNav)}
              type="contacts"
              title={contacts.title}
              description={contacts.description}
              items={contacts.navContacts}
            />
          </Box>
          <Box className="max-md:hidden">
            <Heading headingLevel="h3" variant="card" className={sHeading}>
              {nav.title}
            </Heading>
            <FooterSection className={sNav} type="nav" items={nav.navMenu} />
          </Box>
          <Box className="max-md:hidden">
            <Heading headingLevel="h3" variant="card" className={sHeading}>
              {customerService.title}
            </Heading>
            <FooterSection
              className={sNav}
              type="customerService"
              items={customerService.navCustomerService}
            />
          </Box>
          <Box className="min-w-[25%] max-md:hidden">
            <Heading headingLevel="h3" variant="card" className={sHeading}>
              {social.title}
            </Heading>
            <FooterSection
              className="fgap-3/4 flex flex-col"
              type="social"
              items={social.socialLink}
            />
          </Box>
        </Box>
        <Box className="fmb-2/6 flex items-center justify-end">
          <FooterSection
            className="fgap-3/4 flex flex-wrap"
            type="payments"
            items={payments.paymentIcons}
          />
        </Box>
      </Container>

      <UnderFooter data={underFooter} />
    </footer>
  );
};
