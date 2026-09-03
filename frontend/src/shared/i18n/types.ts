import type AboutPageDict from '@/dictionaries/en/about.json';
import type CollectionsPageDict from '@/dictionaries/en/collections.json';
import type CommonDictionary from '@/dictionaries/en/common.json';
import type HomePageDict from '@/dictionaries/en/home.json';
import type LayoutDictionary from '@/dictionaries/en/layout.json';
import type HomeMetadataDict from '@/dictionaries/en/metadata/home.json';
import { type dynamicRoutes, type staticRoutes } from '@/shared/config/routes';

// -------------------------------------------------------------
// Basic Vocabulary Schemes / Extended
// -------------------------------------------------------------

export type StaticPageName = keyof typeof staticRoutes;
export type DynamicPageName = keyof typeof dynamicRoutes;

export type PageDictionaryName = StaticPageName | DynamicPageName;
export type GlobalDictionaryName = 'common' | 'layout';

export type DictionaryName = GlobalDictionaryName | PageDictionaryName;

export type RawDictionarySchemas = {
  common: typeof CommonDictionary;
  layout: typeof LayoutDictionary;
  home: typeof HomePageDict;
  about: typeof AboutPageDict;
  collections: typeof CollectionsPageDict;
};

export type LayoutDict = RawDictionarySchemas['layout'];
export type CommonDict = RawDictionarySchemas['common'];
export type HomeDict = RawDictionarySchemas['home'];
export type AboutDict = RawDictionarySchemas['about'];
export type CollectionsDict = RawDictionarySchemas['collections'];

export type PageToDictionaryMap = {
  [K in PageDictionaryName]: readonly (GlobalDictionaryName | K)[];
};

export type DictionaryResult<N extends keyof RawDictionarySchemas> =
  RawDictionarySchemas[N];

// -------------------------------------------------------------
// Schema and Types for Metadata
// -------------------------------------------------------------

export type MetadataSchema = {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
  };
};

export type MetadataName = PageDictionaryName | GlobalDictionaryName;

export type RawMetadataSchemas = {
  [K in MetadataName]: typeof HomeMetadataDict;
};

export type MetadataDict<P extends MetadataName> = RawMetadataSchemas[P];

export type MetadataFetcher = <P extends MetadataName>(
  page: P,
  locale: string,
) => Promise<MetadataDict<P>>;
