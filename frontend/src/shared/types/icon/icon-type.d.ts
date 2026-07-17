import { type RouteValue } from '@/shared/config/routes';

import { type IconName } from './icon-name';

export type IconT = {
  icon: IconName;
  title: string;
  href?: RouteValue;
  ariaLabel: string;
};
