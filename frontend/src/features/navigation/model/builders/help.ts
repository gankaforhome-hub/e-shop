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
      href: routes.faq,
    },
    {
      id: 'payments',
      label: dict.payments,
      href: routes.payments,
    },
    {
      id: 'delivery',
      label: dict.delivery,
      href: routes.delivery,
    },
    {
      id: 'returns',
      label: dict.returns,
      href: routes.returns,
    },
  ];
}
