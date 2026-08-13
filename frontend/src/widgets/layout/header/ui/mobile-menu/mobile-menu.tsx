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
// type ActiveView =
//   | { type: 'main' }
//   | { type: 'submenu'; item: INavItemConfig }
//   | { type: 'lang' };

// export function MobileMenu({
//   label,
//   navigation,
//   language,
//   social,
//   contacts,
//   className,
// }: MobileMenuProps) {
//   const [open, setOpen] = useState(false);
//   const [view, setView] = useState<ActiveView>({ type: 'main' });

//   const currentLang = useLocale() as Locale;
//   const activeLabel = language.options.find(
//     opt => opt.code === currentLang,
//   )?.codeLabel;

//   // 1. Скидаємо стан СУВОРО при ВІДКРИТТІ (без setTimeout і без витоків пам'яті)
//   const handleOpenChange = (isOpen: boolean) => {
//     setOpen(isOpen);
//     if (isOpen) {
//       setView({ type: 'main' });
//     }
//   };

//   const handleClose = () => setOpen(false);
//   const handleBack = () => setView({ type: 'main' });

//   const isSubmenuActive = view.type !== 'main';

//   const backTitle =
//     view.type === 'lang'
//       ? language.title
//       : view.type === 'submenu'
//         ? view.item.label
//         : label.backToMenu;

//   return (
//     <Sheet open={open} onOpenChange={handleOpenChange}>
//       <SheetTrigger asChild className={className}>
//         <Button variant="ghost" size="icon" aria-label={label.ariaOpen} asChild>
//           <Icon
//             name="menu"
//             className="text-foreground size-6"
//             aria-hidden="true"
//           />
//         </Button>
//       </SheetTrigger>

//       <SheetContent
//         side="left"
//         className="flex max-w-xs flex-col p-0"
//         onOpenAutoFocus={e => e.preventDefault()}
//         onCloseAutoFocus={e => e.preventDefault()}
//       >
//         {/* HEADER */}
//         <SheetHeader className="border-brand relative border-b-2 px-4 py-3">
//           <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
//           <div className="flex h-8 items-center justify-start">
//             {isSubmenuActive ? (
//               <Button
//                 variant="ghost"
//                 size="small"
//                 onClick={handleBack}
//                 className="h-auto p-0 text-base hover:bg-transparent"
//               >
//                 <Icon
//                   name="chevron-left"
//                   className="mr-1 size-5"
//                   aria-hidden="true"
//                 />
//                 {backTitle}
//               </Button>
//             ) : (
//               <Box className="flex items-center justify-start gap-2">
//                 <Logo variant="logo-icon" className="size-8" />
//                 <Logo variant="logo-text" className="h-6 w-40" />
//               </Box>
//             )}
//             <Button
//               variant="ghost"
//               size="icon"
//               aria-label={label.ariaClose}
//               className="absolute right-4 top-2.5"
//               onClick={handleClose}
//             >
//               <Icon
//                 name="close"
//                 className="text-icon size-4"
//                 aria-hidden="true"
//               />
//             </Button>
//           </div>
//         </SheetHeader>

//         {/* VIEWPORT */}
//         <div className="relative flex-1 overflow-hidden">
//           {/* MAIN MENU: Рендериться завжди */}
//           <div
//             className={cn(
//               'absolute inset-0 flex transform-gpu flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out will-change-transform',
//               isSubmenuActive ? '-translate-x-full' : 'translate-x-0',
//             )}
//           >
//             <nav className="flex w-full flex-col py-2">
//               <MobileMenuBlock
//                 items={navigation.main}
//                 setActiveSubmenu={item => setView({ type: 'submenu', item })}
//                 onClick={handleClose}
//               />
//             </nav>

//             <div className="flex w-full shrink-0 flex-col gap-4 px-4 py-4">
//               <AddressLink
//                 links={contacts}
//                 variant="mobileMenu"
//                 onItemClick={handleClose}
//               />
//               {contacts?.length > 0 && social?.length > 0 && (
//                 <div className="bg-border/40 h-px w-full" />
//               )}
//               <SocialLinks
//                 variant="mobileMenu"
//                 links={social}
//                 onItemClick={handleClose}
//               />
//             </div>
//           </div>

//           {/* SUBMENU: Рендериться ТІЛЬКИ коли активне (DOM чистий!) */}
//           {view.type === 'submenu' && (
//             <div
//               className={cn(
//                 'absolute inset-0 z-10 flex transform-gpu flex-col overflow-y-auto px-4 py-2 transition-transform duration-300 ease-in-out will-change-transform',
//                 'starting:translate-x-full translate-x-0',
//               )}
//             >
//               <MobileSubMenu activeSubmenu={view.item} onClick={handleClose} />
//             </div>
//           )}

//           {/* LANG: Рендериться ТІЛЬКИ коли активне (DOM чистий!) */}
//           {view.type === 'lang' && (
//             <div
//               className={cn(
//                 'absolute inset-0 z-10 flex transform-gpu flex-col overflow-y-auto p-4 transition-transform duration-300 ease-in-out will-change-transform',
//                 'starting:translate-x-full translate-x-0',
//               )}
//             >
//               <LanguageSwitcher
//                 variant="mobile"
//                 languages={language.options}
//                 subtitle={language.subtitle}
//               />
//             </div>
//           )}
//         </div>

//         {/* FOOTER */}
//         <SheetFooter>
//           <MobileMenuQuickActions
//             currentLang={activeLabel}
//             ariaLabelLangMenu={language.subtitle}
//             onActionClick={handleClose}
//             onLanguageClick={() => setView({ type: 'lang' })}
//           />
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// }
type ActiveView =
  | { type: 'main' }
  | { type: 'submenu'; item: INavItemConfig }
  | { type: 'lang' };

export function MobileMenu({
  label,
  navigation,
  language,
  social,
  contacts,
  className,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<ActiveView[]>([{ type: 'main' }]);

  const currentLang = useLocale() as Locale;
  const activeLabel = language.options.find(
    opt => opt.code === currentLang,
  )?.codeLabel;

  const currentView = history[history.length - 1] ?? { type: 'main' };

  const pushView = (nextView: ActiveView) => {
    setHistory(prev => {
      if (prev[prev.length - 1]?.type === nextView.type) {
        return [...prev.slice(0, -1), nextView];
      }
      return [...prev, nextView];
    });
  };

  const handleBack = () => {
    setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setHistory([{ type: 'main' }]);
    }
  };

  const handleClose = () => setOpen(false);
  const isSubmenuActive = currentView.type !== 'main';

  const backTitle =
    currentView.type === 'lang'
      ? language.title
      : currentView.type === 'submenu'
        ? currentView.item.label
        : label.backToMenu;

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
        className="flex max-w-xs flex-col p-0"
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
      >
        {/* HEADER */}
        <SheetHeader className="border-brand/50 relative border-b-2 px-4 py-3">
          <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
          <div className="flex h-8 items-center justify-start">
            {isSubmenuActive ? (
              <Button
                variant="ghost"
                size="small"
                onClick={handleBack}
                className="h-auto p-0 text-base"
              >
                <Icon
                  iconPosition="left"
                  name="chevron-left"
                  className="mr-2 size-5"
                  aria-hidden="true"
                >
                  {backTitle}
                </Icon>
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
              className="absolute right-4 top-2.5"
              onClick={handleClose}
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
        <div className="relative flex-1 overflow-hidden">
          {/* MAIN MENU */}
          <div
            className={cn(
              'absolute inset-0 z-10 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-out',
              isSubmenuActive ? '-translate-x-full' : 'translate-x-0',
            )}
          >
            <nav className="flex w-full flex-col">
              <MobileMenuBlock
                items={navigation.main}
                setActiveSubmenu={item => pushView({ type: 'submenu', item })}
                onClick={handleClose}
              />
            </nav>

            <div className="flex w-full shrink-0 flex-col space-y-4 p-4">
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
          </div>

          {/* SUBMENU PANEL */}
          {currentView.type === 'submenu' && (
            <div className="animate-in slide-in-from-right absolute inset-0 z-10 flex flex-col overflow-y-auto duration-150 ease-out">
              <MobileSubMenu
                activeSubmenu={currentView.item}
                onClick={handleClose}
              />
            </div>
          )}

          {/* LANG PANEL */}
          {currentView.type === 'lang' && (
            <div className="animate-in slide-in-from-right absolute inset-0 z-10 flex flex-col overflow-y-auto px-4 duration-150 ease-out">
              <LanguageSwitcher
                variant="mobile"
                languages={language.options}
                subtitle={language.subtitle}
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <SheetFooter>
          <MobileMenuQuickActions
            currentLang={activeLabel}
            ariaLabelLangMenu={language.subtitle}
            onActionClick={handleClose}
            onLanguageClick={() => pushView({ type: 'lang' })}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
