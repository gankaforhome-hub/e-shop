import { getCollections } from '@/entities/collection';
import { buildInfoNav, buildMainNav } from '@/features/navigation';
import { DesktopLanguageSelector } from '@/features/select-language/ui/desktop-language-selector/desktop-language-selector';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import { parseCommonDictionary } from '@/shared/i18n/schemas/common.schema';
import { cn } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';

import {
  HeaderActions,
  HeaderClientWrapper,
  HeaderLogos,
  HeaderNav,
  HeaderNavWrapper,
  HeaderSpacer,
  MobileMenu,
} from './ui';

interface IHeaderProps {
  lang: Locale;
}

export async function Header({ lang }: IHeaderProps) {
  const HEADER_ID = 'main-header';
  const [
    {
      common,
      layout: { header },
    },
    collections,
  ] = await Promise.all([
    getDictionary(['common', 'layout'], lang),
    getCollections(lang),
  ]);

  const { navigation, contacts, social, languages } =
    parseCommonDictionary(common);

  const mainNav = buildMainNav(navigation.main, collections);
  const infoNav = buildInfoNav(navigation);
  return (
    <>
      <HeaderClientWrapper id={HEADER_ID}>
        <Container className="flex flex-col">
          <div
            className={cn(
              'grid grid-cols-[1fr_auto_1fr] items-center py-2.5',
              'group-data-[show-submenu=false]/header:py-1 group-data-[show-submenu=true]/header:py-4',
              'transition-all duration-300 ease-in-out',
            )}
          >
            <div className="items-center justify-self-start">
              <DesktopLanguageSelector
                languages={languages.options}
                title={languages.title}
                subtitle={languages.subTitle}
              />
              <MobileMenu
                navigation={{ main: mainNav, info: infoNav }}
                language={{
                  options: languages.options,
                  title: languages.title,
                  subtitle: languages.subTitle,
                }}
                social={social}
                contacts={contacts}
                label={header.mobileMenu}
                className="lg:hidden"
              />
            </div>
            <HeaderLogos
              className="min-w-0 max-w-full justify-self-center"
              aria={common.brand.ariaLabel}
            />
            <HeaderActions className="justify-self-end" />
          </div>
          <HeaderNavWrapper>
            <HeaderNav items={mainNav} />
          </HeaderNavWrapper>
        </Container>
      </HeaderClientWrapper>

      <HeaderSpacer />
    </>
  );
}
