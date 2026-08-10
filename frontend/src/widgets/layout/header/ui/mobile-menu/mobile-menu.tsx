'use client';

import { useState } from 'react';

import { ChevronLeft } from 'lucide-react';

import { useLocale } from 'next-intl';

import { type INavItemConfig } from '@/features/navigation';
import { LanguageSwitcher } from '@/features/select-language';
import { type ILanguageOption, type Locale } from '@/shared/i18n/routing';
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

import { MobileMenuQuickActions } from './mobile-menu-footer';
import { MobileMenuBlock } from './mobile-menu-item';
import { MobileSubMenu } from './mobile-sub-menu';

interface MobileMenuProps {
  navItemsMain: INavItemConfig[];
  navItemsHelp?: INavItemConfig[];
  languages: ILanguageOption[];
  langMenuTitle: string;
  langMenuSubtitle: string;
  className?: string;
}

export function MobileMenu({
  navItemsMain,
  navItemsHelp,
  languages,
  langMenuTitle,
  langMenuSubtitle,
  className,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<INavItemConfig | null>(
    null,
  );
  const [isLangOpen, setIsLangOpen] = useState(false);

  const currentLang = useLocale() as Locale;
  const activeLabel = languages.find(
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

  const backTitle = isLangOpen ? langMenuTitle : activeSubmenu?.label || 'Back';
  const isSubmenuActive = Boolean(activeSubmenu || isLangOpen);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild className={className}>
        <Button variant="ghost" size="icon" aria-label="Open menu" asChild>
          <Icon name="menu" className="text-foreground size-6" />
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
                <ChevronLeft className="mr-1 size-5" />
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
              aria-label="Close menu"
              className="absolute right-4 top-4"
              onClick={() => setOpen(false)}
            >
              <Icon name="close" className="text-icon size-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* VIEWPORT */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
          {/* MAIN MENU */}
          <nav
            className={cn(
              'flex w-full flex-col py-2 transition-all duration-300 ease-in-out will-change-transform',
              isSubmenuActive
                ? 'pointer-events-none absolute inset-x-0 top-0 -translate-x-full opacity-0'
                : 'relative translate-x-0 opacity-100',
            )}
          >
            <MobileMenuBlock
              items={navItemsMain}
              setActiveSubmenu={setActiveSubmenu}
              onClick={handleClose}
            />
          </nav>

          {/* CATEGORY SUBMENU */}
          {activeSubmenu && !isLangOpen && (
            <div
              className={cn(
                'bg-background absolute inset-0 flex flex-col px-4 py-2 transition-all duration-300 ease-in-out will-change-transform',
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
                'bg-background absolute inset-0 flex flex-col p-4 transition-all duration-300 ease-in-out will-change-transform',
                'starting:translate-x-full starting:opacity-0 translate-x-0 opacity-100',
              )}
            >
              <LanguageSwitcher
                variant="mobile"
                languages={languages}
                subtitle={langMenuSubtitle}
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <SheetFooter className="p-0">
          <MobileMenuQuickActions
            currentLang={activeLabel}
            onActionClick={handleClose}
            onLanguageClick={() => setIsLangOpen(true)}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
