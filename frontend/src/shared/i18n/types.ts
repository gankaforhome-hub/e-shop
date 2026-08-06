import type AboutPageDict from '@/dictionaries/en/about.json';
import type CommonDictionary from '@/dictionaries/en/common.json';
import type HomePageDict from '@/dictionaries/en/home.json';
import type LayoutDictionary from '@/dictionaries/en/layout.json';
import { type dynamicRoutes, type staticRoutes } from '@/shared/config/routes';

export type StaticPageName = keyof typeof staticRoutes;
export type DynamicPageName = keyof typeof dynamicRoutes;

export type PageDictionaryName = StaticPageName | DynamicPageName;
export type GlobalDictionaryName = 'common' | 'layout';

export type DictionaryName = GlobalDictionaryName | PageDictionaryName;
export type MetadataName = PageDictionaryName;

// 1. Сирі JSON-схеми
export type RawDictionarySchemas = {
  common: typeof CommonDictionary;
  layout: typeof LayoutDictionary;
  home: typeof HomePageDict;
  about: typeof AboutPageDict;
};

export type LayoutDict = RawDictionarySchemas['layout'];
export type CommonDict = RawDictionarySchemas['common'];
export type AboutDict = RawDictionarySchemas['about'];
export type HomeDict = RawDictionarySchemas['home'];

// Маппінг дозволених словників для кожної сторінки
export type PageToDictionaryMap = {
  [K in PageDictionaryName]: readonly (GlobalDictionaryName | K)[];
};

// 2. Результат getDictionary('about') -> повертає { about: AboutDict } або сам AboutDict
export type DictionaryResult<N extends keyof RawDictionarySchemas> =
  RawDictionarySchemas[N];
