import { footerData } from '@/shared/content/layout/footer';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Icon } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';
import { Separator } from '@/shared/ui/separator';

import {
  FooterLinkColumn,
  PaymentBadges,
  SocialLinks,
  UnderFooter,
} from './ui';

export const Footer = () => {
  const {
    brand,
    contacts,
    shopLinks,
    helpLinks,
    socialLinks,
    paymentMethods,
    legalLinks,
  } = footerData;

  return (
    <footer className="bg-surface-muted">
      <Separator variant="accentMuted" />
      <Container className="font-text p-4 pt-6">
        <Box className="grid grid-cols-2 gap-8 px-4 text-center md:grid-cols-4 md:gap-11 xl:flex xl:justify-between 2xl:px-20">
          <Box className="col-span-2 flex flex-col">
            <Box className="max-h-30 mx-auto mb-10 max-w-60 md:mx-0">
              <Logo aria={brand.name} variant="logoFooter" />
            </Box>
            <address>
              <ul className="mt-auto space-y-2 not-italic">
                {contacts.map(item => (
                  <li key={item.href} className="text-left text-base">
                    <AppLink href={item.href} className="group">
                      <Icon
                        name={item.icon}
                        className="group-hover:stroke-text-brand h-5 w-5 shrink-0"
                        aria-hidden="true"
                        iconPosition="left"
                      >
                        {item.label}
                      </Icon>
                    </AppLink>
                  </li>
                ))}
              </ul>
            </address>
          </Box>
          <FooterLinkColumn
            heading="Shop"
            links={shopLinks}
            className="col-start-1 row-start-2 text-left md:col-start-3 md:row-start-1"
          />
          <FooterLinkColumn
            heading="Help"
            links={helpLinks}
            className="col-start-2 row-start-2 text-left md:col-start-4 md:row-start-1"
          />
          <Box className="max-xl:contents xl:flex xl:flex-col xl:gap-5">
            <SocialLinks
              links={socialLinks}
              className="col-span-2 row-start-3 text-left md:col-span-2 md:col-start-1 md:row-start-2"
            />
            <PaymentBadges
              methods={paymentMethods}
              className="col-span-2 row-start-4 text-left md:col-span-2 md:col-start-3 md:row-start-2"
            />
          </Box>
        </Box>
        <UnderFooter legalLinks={legalLinks} />
      </Container>
    </footer>
  );
};
