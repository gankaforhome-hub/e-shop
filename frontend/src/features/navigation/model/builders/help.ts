import { routes } from '@/shared/config/routes';

import { type BuildNavParams, type INavItemConfig } from '../types';

interface BuildHelpNavParams extends BuildNavParams {}

export function getHelpNavConfig({
  dict,
}: BuildHelpNavParams): INavItemConfig[] {
  const helpDict = dict.help || {};

  return [
    {
      id: 'contacts',
      labelKey: helpDict.contacts || 'Contacts',
      href: routes.contacts,
    },
    {
      id: 'faq',
      labelKey: helpDict.faq || 'FAQ',
      href: routes.faq,
    },
    {
      id: 'payments',
      labelKey: helpDict.payments || 'Payments',
      href: routes.payments,
    },
    {
      id: 'delivery',
      labelKey: helpDict.delivery || 'Delivery',
      href: routes.delivery,
    },
    {
      id: 'returns',
      labelKey: helpDict.returns || 'Returns',
      href: routes.returns,
    },
  ];
}
