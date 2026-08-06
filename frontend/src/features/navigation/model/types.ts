import { type AppRoutes } from '@/shared/config';

export interface INavItemConfig {
  id: string;
  labelKey: string; // ключ із вашого JSON-словника navigation.main / help / legal
  href: AppRoutes;
  descriptionKey?: string;
  children?: INavItemConfig[];
}

export interface NavDictionary {
  [group: string]: Record<string, string>;
}

export interface BuildNavParams {
  dict: NavDictionary;
}
