import { type CategoryDTO } from '@/entities/category';
import {
  type CatalogFilterParam,
  type ProductFilters,
} from '@/entities/product/catalog';
import { type CategorySlug } from '@/shared/config/routes';

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

/** Panel groups per category scope, so a draft category can switch them. */
export type CategoryFilterGroups = {
  /** No category selected. */
  all: FilterGroupView[];
  byCategory: Partial<Record<CategorySlug, FilterGroupView[]>>;
};

export type CategoryOption = Pick<CategoryDTO, 'slug' | 'title'>;

/** What the filter panel edits locally and applies in one navigation. */
export type FilterDraft = {
  category: CategorySlug | undefined;
  filters: ProductFilters;
};
