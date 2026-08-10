import { getCollections } from '@/entities/collection';
import {
  buildHelpNav,
  buildLegalNav,
  buildMainNav,
} from '@/features/navigation';
import { DesktopLanguageSelector } from '@/features/select-language/ui/desktop-language-selector/desktop-language-selector';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { parseCommonDictionary } from '@/shared/i18n/schemas/common.schema';
import { Container } from '@/shared/ui/container';

import {
  HeaderActions,
  HeaderClientWrapper,
  HeaderDesktopNav,
  HeaderLogos,
  HeaderNav,
  HeaderSpacer,
  MobileMenu,
} from './ui';

interface IHeaderProps {
  lang: string;
}

export async function Header({ lang }: IHeaderProps) {
  const HEADER_ID = 'main-header';
  const [
    {
      common,
      layout: { footer },
    },
    collections,
  ] = await Promise.all([
    getDictionary(['common', 'layout'], lang),
    getCollections(),
  ]);

  const { navigation, contacts, paymentMethods, social, languages } =
    parseCommonDictionary(common);

  const mainNav = buildMainNav(navigation.main, collections);
  const helpNav = buildHelpNav(navigation.help);
  const legalNav = buildLegalNav(navigation.legal);
  return (
    <>
      <HeaderClientWrapper id={HEADER_ID}>
        <Container className="flex flex-col px-6 max-[300px]:px-0">
          {/* ВЕРХНІЙ БЛОК */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center py-2.5 transition-all duration-300 ease-in-out group-data-[show-submenu=true]/header:py-4">
            {/* L-блок (Мова / Бургер для мобільних) */}
            <div className="items-center justify-self-start">
              <DesktopLanguageSelector
                languages={languages.options}
                title={languages.title}
                subtitle={languages.subTitle}
              />
              <MobileMenu
                navItemsMain={mainNav}
                languages={languages.options}
                langMenuTitle={languages.title}
                langMenuSubtitle={languages.subTitle}
                navItemsHelp={helpNav}
                className="lg:hidden"
              />
            </div>

            {/* C-блок (Логотипи) */}
            <HeaderLogos />

            {/* R-блок (Кнопки дій) */}
            <HeaderActions />
          </div>

          {/* НИЖНЄ МЕНЮ */}
          <HeaderDesktopNav>
            <HeaderNav items={mainNav} />
          </HeaderDesktopNav>
        </Container>
      </HeaderClientWrapper>

      {/* РОЗПІРКА ДЛЯ УНИКНЕННЯ JUMPING LAYOUT */}
      <HeaderSpacer />
    </>
  );
}
