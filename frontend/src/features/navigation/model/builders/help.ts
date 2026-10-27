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
      id: 'payment_delivery',
      label: dict.payment_delivery,
      href: routes.info('payment-delivery'),
    },
    {
      id: 'returns_exchanges',
      label: dict.returns_exchanges,
      href: routes.info('returns-exchanges'),
    },
    {
      id: 'public_offer',
      label: dict.public_offer,
      href: routes.info('public-offer'),
    },
  ];
}
