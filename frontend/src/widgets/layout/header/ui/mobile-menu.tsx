// 'use client';

// import { type FC, useState } from 'react';

// import { type NavItem, type TopBar } from '@/shared/types';
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from '@/shared/ui/drawer';

// interface IMobileMenuProps {
//   navMenu: NavItem[];
//   topBar: TopBar;
// }

// export const MobileMenu: FC<IMobileMenuProps> = ({ navMenu, topBar }) => {
//   const [_isOpen, setIsOpen] = useState<boolean>(false);

//   const [_isOpenSubMenu, _setIsOpenSubMenu] = useState<boolean>(false);

//   const _closeMenu = () => {
//     setIsOpen(false);
//   };
//   const [page, setPage] = useState(0);
//   const totalPages = 2; // лише головна і підменю

//   // const shopMenu = [topBar.contactUs, topBar.language, topBar.favorite];

//   type TopBar = typeof topBar.navIcon;
//   type TopBarKey = keyof TopBar; // 'contactUs' | 'language' | 'favorite'

//   const shopMenu: TopBar[TopBarKey][] = [
//     topBar.navIcon.contactUs,
//     topBar.navIcon.language,
//     topBar.navIcon.favorite,
//   ];
//   const shopMenuKey: TopBarKey[] = ['contactUs', 'language', 'favorite'];

//   const [activeSubmenu, setActiveSubmenu] = useState<TopBarKey | null>(null);

//   return (
//     <>
//       <Drawer direction="left">
//         <DrawerTrigger asChild>
//           <button className="bg-black p-4 text-white">Відкрити меню</button>
//         </DrawerTrigger>

//         <DrawerContent className="fixed left-0 top-0 h-full w-full max-w-sm overflow-hidden bg-white p-0">
//           <div
//             className="flex h-full"
//             style={{
//               width: `${100 * totalPages}%`,
//               transform: `translateX(-${page * (100 / totalPages)}%)`,
//               transition: 'transform 500ms ease-in-out',
//             }}
//           >
//             {/* The main menu */}
//             <div
//               className="shrink-0 p-4"
//               style={{ width: `${100 / totalPages}%` }}
//             >
//               <DrawerHeader>
//                 <DrawerTitle>Головне меню</DrawerTitle>
//               </DrawerHeader>
//               {shopMenu.map((item, index) => {
//                 const key = shopMenuKey[index];
//                 if (!key) {
//                   return null;
//                 } // пропустити, якщо ключ відсутній

//                 return (
//                   <button
//                     key={key}
//                     onClick={() => {
//                       setActiveSubmenu(key); // тепер key точно string
//                       setPage(1);
//                     }}
//                     className="mt-4 block w-full bg-gray-100 p-4 text-left text-black hover:bg-gray-200"
//                   >
//                     → {item.title}
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Submenu (dynamic) */}
//             <div
//               className="shrink-0 p-4"
//               style={{ width: `${100 / totalPages}%` }}
//             >
//               <DrawerHeader>
//                 <DrawerTitle className="text-black">
//                   {activeSubmenu ? topBar.navIcon[activeSubmenu].title : ''}
//                 </DrawerTitle>
//               </DrawerHeader>
//               <button
//                 onClick={() => setPage(0)}
//                 className="text-2xl text-black"
//               >
//                 ← Назад
//               </button>
//               <div className="mt-4 text-black">
//                 {activeSubmenu && (
//                   <>
//                     <p>Іконка: {topBar.navIcon[activeSubmenu].icon}</p>
//                     <p>Посилання: {topBar.navIcon[activeSubmenu].href}</p>
//                     <p>Aria label: {topBar.navIcon[activeSubmenu].ariaLabel}</p>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </DrawerContent>
//       </Drawer>
//     </>
//   );
// };

'use client';

import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'; // Твій шлях до Shadcn Sheet

// Типи даних навігації
interface NavItem {
  title: string;
  href?: string;
  hasSubmenu?: boolean;
}

const mainNavItems: NavItem[] = [
  { title: 'Collections', hasSubmenu: true },
  { title: 'All products', href: '/catalog' },
  { title: 'About Us', href: '/about' },
  { title: 'Exclusive', href: '/exclusive' },
  { title: 'Releases', href: '/releases' },
];

const collectionsItems = [
  { title: 'Agro Collection', href: '/collections/agro' },
  { title: 'Summer collections', href: '/collections/summer' },
  { title: 'Winter collections', href: '/collections/winter' },
  { title: 'Spring collections', href: '/collections/spring' },
  { title: 'Privet collection', href: '/collections/privet' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setActiveSubmenu(null), 300); // скидаємо вкладеність після закриття
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-10 w-10 shrink-0" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex w-full max-w-xs flex-col p-0 sm:max-w-sm"
      >
        {/* 1. ВЕРХНІЙ БЛОК: Швидкі дії (User, Wishlist, Cart, Search) */}
        <SheetHeader className="border-b p-4">
          <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {/* Пошук */}
              <Button variant="ghost" size="icon" asChild onClick={handleClose}>
                <Link href="/search" aria-label="Search">
                  <Search className="h-10 w-10 shrink-0" />
                </Link>
              </Button>

              {/* Профіль */}
              <Button variant="ghost" size="icon" asChild onClick={handleClose}>
                <Link href="/account" aria-label="Account">
                  <User className="h-10 w-10 shrink-0" />
                </Link>
              </Button>

              {/* Вішлист із бейджем */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                asChild
                onClick={handleClose}
              >
                <Link href="/wishlist" aria-label="Wishlist">
                  <Heart className="h-10 w-10 shrink-0" />
                  <span className="bg-primary text-primary-foreground absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                    2
                  </span>
                </Link>
              </Button>
            </div>

            {/* Корзина */}
            <Button
              variant="outline"
              size="icon"
              className="relative gap-2"
              asChild
              onClick={handleClose}
            >
              <Link href="/cart">
                <ShoppingBag className="h-10 w-10 shrink-0" />
                <span className="text-xs font-semibold">Cart (1)</span>
              </Link>
            </Button>
          </div>
        </SheetHeader>

        {/* 2. НАВІГАЦІЙНА ЧАСТИНА (З плавним перемиканням) */}
        <div className="relative flex-1 overflow-x-hidden">
          {/* Головне Меню */}
          <div
            className={cn(
              'absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out',
              activeSubmenu ? '-translate-x-full' : 'translate-x-0',
            )}
          >
            <nav className="flex-1 divide-y">
              <div className="py-2">
                {mainNavItems.map(item => (
                  <div key={item.title}>
                    {item.hasSubmenu ? (
                      <button
                        type="button"
                        onClick={() => setActiveSubmenu(item.title)}
                        className="hover:bg-muted/50 flex w-full items-center justify-between px-6 py-4 text-left text-base font-medium transition-colors"
                      >
                        <span>{item.title}</span>
                        {/* 👈 Стрілочка ТІЛЬКИ там, де є підменю */}
                        <ChevronRight className="text-muted-foreground h-5 w-5" />
                      </button>
                    ) : (
                      <Link
                        href={item.href || '#'}
                        onClick={handleClose}
                        className="hover:bg-muted/50 flex w-full items-center justify-between px-6 py-4 text-base font-medium transition-colors"
                      >
                        <span>{item.title}</span>
                        {/* Без іконки для звичайних переходів */}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Нижні налаштування (Мова тощо) */}
            <div className="border-t p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sm"
              >
                <Globe className="h-4 w-4 shrink-0" />
                <span>Language: EN</span>
              </Button>
            </div>
          </div>

          {/* Підменю Колекцій */}
          <div
            className={cn(
              'bg-background absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out',
              activeSubmenu === 'Collections'
                ? 'translate-x-0'
                : 'translate-x-full',
            )}
          >
            {/* Шапка підменю з кнопкою "Назад" */}
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveSubmenu(null)}
                className="text-muted-foreground gap-1 p-1"
              >
                <ChevronLeft className="h-10 w-10 shrink-0" />
                <span>Back</span>
              </Button>
              <span className="font-semibold">{activeSubmenu}</span>
            </div>

            {/* Список колекцій */}
            <nav className="flex-1 divide-y overflow-y-auto">
              {collectionsItems.map(collection => (
                <Link
                  key={collection.title}
                  href={collection.href}
                  onClick={handleClose}
                  className="hover:bg-muted/50 flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors"
                >
                  <span>{collection.title}</span>
                  {/* Прямий перехід на конкретну колекцію без стрілок або з легким оперуванням */}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
