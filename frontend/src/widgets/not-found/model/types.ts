import { AppRoutes, ExternalHref } from '@/shared/config';
import { type IconName } from '@/shared/types/icon';

export type ContactLink = {
  href: ExternalHref | AppRoutes;
  label: string;
  icon: IconName;
  ariaLabel: string;
};
