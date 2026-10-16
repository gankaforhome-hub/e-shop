import { type CatalogFilterParam } from '@/entities/product/catalog';

export type FilterOptionView = {
  value: string;
  label: string;
  count: number;
};

/** One localized filter group, ready to render (built on the server). */
export type FilterGroupView = {
  param: CatalogFilterParam;
  label: string;
  options: FilterOptionView[];
};
