import { type dynamicRoutes, type staticRoutes } from '../config/routes';

export type StaticPageName = keyof typeof staticRoutes;
export type DynamicPageName = keyof typeof dynamicRoutes;

export type PageDictionaryName = StaticPageName | DynamicPageName;
export type GlobalDictionaryName = 'common' | 'layout';

export type PageToDictionaryMap = {
  [K in PageDictionaryName]: GlobalDictionaryName | K;
};

export type DictionaryName = GlobalDictionaryName | PageDictionaryName;

export type MetadataName = PageDictionaryName;
