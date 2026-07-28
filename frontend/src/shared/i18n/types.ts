import { type dynamicRoutes, type staticRoutes } from '../config/routes';

export type StaticPageName = keyof typeof staticRoutes;
export type DynamicPageName = keyof typeof dynamicRoutes;

// 2. Загальна назва сторінки для словників
export type PageDictionaryName = StaticPageName | DynamicPageName;
// export const pageDictionaries = [
//   'home_page',
//   // 'product_page',
//   // 'category_page',
// ] as const;

// export type PageDictionaryName = (typeof pageDictionaries)[number];
export type LayoutDictionary = 'common' | 'layout';

// export type PageToDictionaryMap = {
//   home_page: LayoutDictionary | 'home_page';
//   // product_page: LayoutDictionary | 'product_page';
//   // category_page: LayoutDictionary | 'category_page';
// };

export type PageToDictionaryMap = {
  [K in PageDictionaryName]: LayoutDictionary | K;
};

export type DictionaryName = LayoutDictionary | PageDictionaryName;

export type MetadataName = PageDictionaryName;
