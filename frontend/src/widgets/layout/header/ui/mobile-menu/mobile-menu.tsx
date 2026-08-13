'use client';

import { useState } from 'react';

import { useLocale } from 'next-intl';

import { type INavItemConfig } from '@/features/navigation';
import { LanguageSwitcher } from '@/features/select-language';
import { type ILanguageOption, type Locale } from '@/shared/i18n/routing';
import { type NavItem } from '@/shared/i18n/schemas/common.schema';
import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { AddressLink, SocialLinks } from '@/widgets/layout/ui';

import { MobileMenuQuickActions } from './mobile-menu-footer';
import { MobileMenuBlock } from './mobile-menu-item';
import { MobileSubMenu } from './mobile-sub-menu';

interface MobileMenuProps {
  label: { backToMenu: string; ariaOpen: string; ariaClose: string };
  navigation: {
    main: INavItemConfig[];
  };
  language: {
    options: ILanguageOption[];
    title: string;
    subtitle: string;
  };
  social: NavItem[];
  contacts: NavItem[];
  className?: string;
}

export function MobileMenu({
  label,
  navigation,
  language,
  social,
  contacts,
  className,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<INavItemConfig | null>(
    null,
  );
  const [isLangOpen, setIsLangOpen] = useState(false);

  const currentLang = useLocale() as Locale;
  const activeLabel = language.options.find(
    opt => opt.code === currentLang,
  )?.codeLabel;

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setActiveSubmenu(null);
        setIsLangOpen(false);
      }, 300);
    }
  };

  const handleClose = () => handleOpenChange(false);

  const handleBack = () => {
    if (isLangOpen) {
      setIsLangOpen(false);
    } else {
      setActiveSubmenu(null);
    }
  };

  const backTitle = isLangOpen
    ? language.title
    : activeSubmenu?.label || label.backToMenu;
  const isSubmenuActive = Boolean(activeSubmenu || isLangOpen);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild className={className}>
        <Button variant="ghost" size="icon" aria-label={label.ariaOpen} asChild>
          <Icon
            name="menu"
            className="text-foreground size-6"
            aria-hidden="true"
          />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="max-w-xs"
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
      >
        {/* HEADER */}
        <SheetHeader className="border-brand relative border-b-2 px-4 py-3">
          <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
          <div className="flex h-8 items-center justify-start">
            {isSubmenuActive ? (
              <Button
                variant="ghost"
                size="small"
                onClick={handleBack}
                className="h-auto p-0 text-base hover:bg-transparent"
              >
                <Icon
                  name="chevron-left"
                  className="mr-1 size-5"
                  aria-hidden="true"
                />
                {backTitle}
              </Button>
            ) : (
              <Box className="flex items-center justify-start gap-2">
                <Logo variant="logo-icon" className="size-8" />
                <Logo variant="logo-text" className="h-6 w-40" />
              </Box>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label={label.ariaClose}
              className="absolute right-4 top-4"
              onClick={() => setOpen(false)}
            >
              <Icon
                name="close"
                className="text-icon size-4"
                aria-hidden="true"
              />
            </Button>
          </div>
        </SheetHeader>

        {/* VIEWPORT */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex min-h-full flex-col justify-between">
            <div className="bg-background w-full flex-1">
              <nav
                className={cn(
                  'flex w-full flex-col py-2 transition-all duration-300 ease-in-out will-change-transform',
                  isSubmenuActive
                    ? 'pointer-events-none absolute inset-x-0 top-0 -translate-x-full opacity-0'
                    : 'relative translate-x-0 opacity-100',
                )}
              >
                <MobileMenuBlock
                  items={navigation.main}
                  setActiveSubmenu={setActiveSubmenu}
                  onClick={handleClose}
                />
              </nav>
              {/* CATEGORY SUBMENU */}
              {activeSubmenu && !isLangOpen && (
                <div
                  className={cn(
                    'absolute inset-0 z-10 flex flex-col overflow-y-auto px-4 py-2 transition-all duration-300 ease-in-out will-change-transform',
                    'starting:translate-x-full starting:opacity-0 translate-x-0 opacity-100',
                  )}
                >
                  <MobileSubMenu
                    activeSubmenu={activeSubmenu}
                    onClick={handleClose}
                  />
                </div>
              )}

              {/* LANGUAGE SUBMENU */}
              {isLangOpen && (
                <div
                  className={cn(
                    'absolute inset-0 z-10 flex flex-col overflow-y-auto p-4 transition-all duration-300 ease-in-out will-change-transform',
                    'starting:translate-x-full starting:opacity-0 translate-x-0 opacity-100',
                  )}
                >
                  <LanguageSwitcher
                    variant="mobile"
                    languages={language.options}
                    subtitle={language.subtitle}
                  />
                </div>
              )}
            </div>

            {/* CONTACTS + SOCIALS */}
            {!isSubmenuActive && (
              <div className="flex w-full shrink-0 flex-col gap-4 px-4 py-4">
                <AddressLink
                  links={contacts}
                  variant="mobileMenu"
                  onItemClick={handleClose}
                />
                {contacts?.length > 0 && social?.length > 0 && (
                  <div className="bg-border/40 h-px w-full" />
                )}
                <SocialLinks
                  variant="mobileMenu"
                  links={social}
                  onItemClick={handleClose}
                />
              </div>
            )}
          </div>
        </div>
        {/* FOOTER */}
        <SheetFooter className="mt-4 flex flex-col">
          <MobileMenuQuickActions
            currentLang={activeLabel}
            ariaLabelLangMenu={language.subtitle}
            onActionClick={handleClose}
            onLanguageClick={() => setIsLangOpen(true)}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
