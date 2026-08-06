import { useTranslations } from 'next-intl';

import { footerData } from '@/shared/content/layout/footer';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Icon } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';
import { Separator } from '@/shared/ui/separator';

import { PaymentBadges, SocialLinks } from './ui';

interface FooterNavProps {
  // dict: string;
  className?: string;
}

export const Footer = ({ className }: FooterNavProps) => {
  const t = useTranslations('common');
  console.log('🚀 ~ Footer ~ t:');
  // const navItemsMain = getMainNavConfig({ dict });
  // const navItemsHelp = getHelpNavConfig({ dict });
  // const navItemsLegal = getLegalNavConfig({ dict });

  const { brand, contacts, socialLinks, paymentMethods } = footerData;

  return (
    <footer className="bg-muted font-caption">
      <Separator variant="accentMuted" />
      <Container className="p-4 pt-6">
        <Box className="grid grid-cols-2 gap-8 px-4 text-center md:grid-cols-4 md:gap-11 xl:flex xl:justify-between 2xl:px-20">
          <Box className="col-span-2 flex flex-col">
            <Box className="max-h-30 mx-auto mb-10 flex max-w-60 flex-col items-center gap-4 md:mx-0">
              <Logo
                aria={brand.name}
                variant="logo-icon"
                className="sm:h-22 sm:w-22 h-20 w-20"
                asLink
              />
              <Logo
                aria={brand.name}
                variant="logo-text"
                className="w-50 h-8 sm:h-10 sm:w-60"
              />
            </Box>
            <address className="not-italic">
              <ul className="mt-auto space-y-2">
                {contacts.map(item => (
                  <li key={item.href} className="text-left text-base">
                    <AppLink href={item.href} className="group">
                      <Icon
                        name={item.icon}
                        className="group-hover:text-icon-hover h-5 w-5 shrink-0"
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
          {/* <FooterLinkColumn
            heading="Shop"
            links={navItemsMain}
            className="col-start-1 row-start-2 text-left md:col-start-3 md:row-start-1"
          />
          <FooterLinkColumn
            heading="Help"
            links={navItemsHelp}
            className="col-start-2 row-start-2 text-left md:col-start-4 md:row-start-1"
          /> */}
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
        {/* <UnderFooter legalLinks={navItemsLegal} /> */}
      </Container>
    </footer>
  );
};
