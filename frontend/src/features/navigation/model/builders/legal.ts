import { routes } from '@/shared/config/routes';

import { type INavItemConfig, type NavigationDict } from '../types';

export function getLegalNavConfig(
  dict: NavigationDict['legal'],
): INavItemConfig[] {
  return [
    {
      id: 'terms_conditions',
      label: dict.terms_conditions,
      href: routes.terms_conditions,
    },
    {
      id: 'privacy_policy',
      label: dict.privacy_policy,
      href: routes.privacy_policy, // 👈 Виправлено баг (було routes.faq)
    },
    {
      id: 'cookie_policy',
      label: dict.cookie_policy,
      href: routes.cookie_policy,
    },
  ];
}
