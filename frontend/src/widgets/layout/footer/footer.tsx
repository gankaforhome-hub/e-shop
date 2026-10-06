import {
  buildHelpNav,
  buildLegalNav,
  buildMainNav,
} from '@/features/navigation';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { parseCommonDictionary } from '@/shared/i18n/schemas/common.schema';
import { cn } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';
import { Logo } from '@/shared/ui/logo';
import { Separator } from '@/shared/ui/separator';

import { AddressLink, SocialLinks } from '../ui';
import { FooterLinkColumn, PaymentBadges, UnderFooter } from './ui';

interface IFooterNavProps {
  lang: string;
  className?: string;
}

export async function Footer({ lang, className }: IFooterNavProps) {
  const {
    common,
    layout: { footer },
  } = await getDictionary(['common', 'layout'], lang);
  const { navigation, contacts, paymentMethods, social } =
    parseCommonDictionary(common);

  const mainNav = buildMainNav(navigation.main);
  const helpNav = buildHelpNav(navigation.help);
  const legalNav = buildLegalNav(navigation.legal);

  return (
    <footer className={cn('bg-muted font-caption', className)}>
      <Separator variant="accentMuted" />
      <Container className="p-4 pt-6">
        <div
          className={cn(
            'grid grid-cols-2 gap-8 px-4 text-center md:grid-cols-4 md:gap-11 xl:flex xl:justify-between 2xl:px-20',
          )}
        >
          <div className={cn('col-span-2 flex flex-col')}>
            <div className="max-h-30 mx-auto mb-10 flex max-w-60 flex-col items-center gap-2 md:mx-0">
              <Logo
                aria={common.brand.ariaLabel}
                variant="logo-icon"
                className="sm:h-22 sm:w-22 h-20 w-20"
                asLink
              />
              <Logo
                aria={common.brand.ariaLabel}
                variant="logo-text"
                className="w-50 h-8 max-[300px]:hidden sm:h-10 sm:w-60"
                asLink
              />
            </div>
            <AddressLink variant="footer" links={contacts} />
          </div>
          <FooterLinkColumn
            heading={footer.mainMenuTitle}
            links={mainNav}
            className={cn(
              'col-start-1 row-start-2 text-left md:col-start-3 md:row-start-1',
            )}
          />
          <FooterLinkColumn
            heading={footer.helpMenuTitle}
            links={helpNav}
            className={cn(
              'max-[300px]:col-start-1 max-[300px]:row-start-3',
              'col-start-2 row-start-2 text-left md:col-start-4 md:row-start-1',
            )}
          />
          <div className="max-xl:contents xl:flex xl:flex-col xl:gap-5">
            <SocialLinks
              variant="footer"
              heading={footer.socialMenuTitle}
              links={social}
              className={cn(
                'max-[300px]:col-start-1 max-[300px]:row-start-4',
                'col-span-2 row-start-3 text-left md:col-span-2 md:col-start-1 md:row-start-2',
              )}
            />
            <PaymentBadges
              heading={footer.paymentMenuTitle}
              methods={paymentMethods}
              className={cn(
                'max-[300px]:col-start-1 max-[300px]:row-start-5',
                'col-span-2 row-start-4 text-left md:col-span-2 md:col-start-3 md:row-start-2',
              )}
            />
          </div>
        </div>
        <UnderFooter legalLinks={legalNav} />
      </Container>
    </footer>
  );
}
