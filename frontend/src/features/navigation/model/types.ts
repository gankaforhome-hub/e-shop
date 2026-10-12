import { type AppRoutes } from '@/shared/config/routes';
import { type CommonDict } from '@/shared/i18n/types';

export interface INavItemConfig {
  id: string;
  label: string;
  href: AppRoutes;
  description?: string;
  children?: INavItemConfig[];
}

export type NavigationDict = CommonDict['navigation'];
