export const pageDictionaries = [
  'home_page',
  'product_page',
  'category_page',
] as const;

export type PageDictionaryName = (typeof pageDictionaries)[number];
export type LayoutDictionary = 'common' | 'layout';

export type PageToDictionaryMap = {
  home_page: LayoutDictionary | 'home_page';
  product_page: LayoutDictionary | 'product_page';
  category_page: LayoutDictionary | 'category_page';
};

export type DictionaryName = LayoutDictionary | PageDictionaryName;

export type MetadataName = PageDictionaryName;
