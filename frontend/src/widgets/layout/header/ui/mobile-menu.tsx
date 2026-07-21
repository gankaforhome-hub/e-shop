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
