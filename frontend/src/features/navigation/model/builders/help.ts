import { routes } from '@/shared/config/routes';

import { type INavItemConfig, type NavigationDict } from '../types';

export function getHelpNavConfig(
  dict: NavigationDict['help'],
): INavItemConfig[] {
  return [
    {
      id: 'contacts',
      label: dict.contacts,
      href: routes.contacts,
    },
    {
      id: 'faq',
      label: dict.faq,
      href: routes.info('faq'),
    },
    {
      id: 'payments',
      label: dict.payments,
      href: routes.info('payments'),
    },
    {
      id: 'delivery',
      label: dict.delivery,
      href: routes.info('delivery'),
    },
    {
      id: 'returns',
      label: dict.returns,
      href: routes.info('returns'),
    },
  ];
}
