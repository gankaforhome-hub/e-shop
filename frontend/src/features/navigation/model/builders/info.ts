import { routes } from '@/shared/config/routes';

import { type INavItemConfig, type NavigationDict } from '../types';

export function getInfoNavConfig(
  dict: Omit<NavigationDict, 'aria'>,
): INavItemConfig[] {
  return [
    {
      id: 'privacy-policy',
      label: dict.legal.privacy_policy,
      href: routes.info('privacy-policy'),
    },
    {
      id: 'terms-conditions',
      label: dict.legal.terms_conditions,
      href: routes.info('terms-conditions'),
    },
    {
      id: 'cookie-policy',
      label: dict.legal.cookie_policy,
      href: routes.info('cookie-policy'),
    },
    {
      id: 'faq',
      label: dict.help.faq,
      href: routes.info('faq'),
    },
    {
      id: 'payments',
      label: dict.help.payments,
      href: routes.info('payments'),
    },
    {
      id: 'delivery',
      label: dict.help.delivery,
      href: routes.info('delivery'),
    },
    {
      id: 'returns',
      label: dict.help.returns,
      href: routes.info('returns'),
    },
  ];
}
