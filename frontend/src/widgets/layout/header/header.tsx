'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { type Collection } from '@/entities/collection/model/types';
import { useScroll } from '@/shared/lib/hooks/useScroll';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Icon } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';

interface IHeaderProps {
  // lang: Locale;
  className?: string;
  collections: Collection[];
  // dict: CommonDict['navigation'];
  // languages: ILanguageOption[];
}

export function Header({ collections }: IHeaderProps) {
  const t = useTranslations('common');
  // const navItemsMain = getMainNavConfig({ dict, collections });
  // const navItemsHelp = getHelpNavConfig({ dict });
  const { isScrolled, showSubMenu, setIsHovered } = useScroll(30);

  const headerRef = useRef<HTMLElement>(null);
  const [initialHeaderHeight, setInitialHeaderHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setInitialHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <>
      {/* 1. ФІКСОВАНИЙ ХЕДЕР */}
      <header
        ref={headerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'pointer-events-auto fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out',
          // Захист для планшетів та iOS overscroll
          'before:h-50 before:absolute before:bottom-full before:left-0 before:right-0 before:bg-white',
          // Фон: білий при відкритому меню, напівпрозорий blur при згорнутому
          !showSubMenu ? 'bg-white/20 backdrop-blur-md' : 'bg-white',
          // Тінь при скролі
          isScrolled
            ? showSubMenu
              ? 'shadow-lg shadow-black/5'
              : 'shadow-md shadow-black/5'
            : 'shadow-none',
        )}
      >
        <Container className="flex flex-col px-6 max-[300px]:px-0">
          {/* ВЕРХНІЙ БЛОК */}
          <div
            className={cn(
              'grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300 ease-in-out',
              !showSubMenu ? 'py-2.5' : 'py-4',
            )}
          >
            {/* L-блок (Мова / Бургер для мобільних) */}
            <div className="items-center justify-self-start">
              {/* Desctop Lang Menu */}
              {/* <DesktopLanguageSelector
                languages={languages}
                title={'title'}
                subtitle={'subtitle'}
              /> */}
              {/* <MobileMenu
                navItemsMain={navItemsMain}
                languages={languages}
                navItemsHelp={navItemsHelp}
                className="lg:hidden"
              /> */}
            </div>
            {/* C-блок (Логотипи) */}
            <div className="flex min-w-0 max-w-full items-center gap-4 justify-self-center">
              <Logo
                aria={'gankaforhome'}
                variant="logo-icon"
                className="h-8 w-8 md:h-11 md:w-11 lg:h-12 lg:w-12"
                asLink
              />
              <Logo
                aria={'gankaforhome'}
                variant="logo-text"
                className="w-50 lg:w-75 h-12 max-[320px]:hidden md:h-11 md:w-60 lg:h-12"
              />
            </div>

            {/* R-блок (Кнопки дій) */}
            <div className="flex items-center gap-4 justify-self-end md:gap-6">
              <Button variant="ghost" size="icon" className="max-md:hidden">
                <Icon name="search" size={24} />
              </Button>
              <Button variant="ghost" size="icon" className="max-md:hidden">
                <Icon name="user" size={24} className="max-md:hidden" />
              </Button>
              <Button variant="ghost" size="icon" className="max-md:hidden">
                <Icon name="favorite" size={24} className="max-md:hidden" />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="shopping-cart" size={24} />
              </Button>
            </div>
          </div>

          {/* НИЖНЄ МЕНЮ — Додано `hidden md:grid` */}
          <div
            className={cn(
              'hidden transition-all duration-300 ease-in-out md:grid',
              showSubMenu
                ? 'grid-rows-[1fr] pb-3 pt-1 opacity-100'
                : 'pointer-events-none grid-rows-[0fr] py-0 opacity-0',
            )}
          >
            <div className="overflow-hidden">
              {/* <HeaderNav items={navItemsMain} /> */}
            </div>
          </div>
        </Container>
      </header>

      {/* 2. РОЗПІРКА */}
      <div
        aria-hidden="true"
        style={{
          height: initialHeaderHeight ? `${initialHeaderHeight}px` : '70px',
        }}
      />
    </>
  );
}

// import { getTranslations, getLocale } from 'next-intl/server';
// import { type ILanguageOption, type Locale } from '@/shared/i18n/config';
// import { DesktopLanguageSelector } from '@/features/language-switcher';

// export async function Header() {
//   const t = await getTranslations('LanguageMenu');
//   const currentLocale = (await getLocale()) as Locale;

//   const languages: ILanguageOption[] = [
//     { code: 'ua', label: t('locales.ua') },
//     { code: 'en', label: t('locales.en') },
//   ];

//   return (
//     <header className="flex items-center justify-between p-4">
//       {/* Інші елементи хедера */}

//       <DesktopLanguageSelector
//         languages={languages}
//         title={t('title')}
//         subtitle={t('subtitle')}
//       />
//     </header>
//   );
// }
