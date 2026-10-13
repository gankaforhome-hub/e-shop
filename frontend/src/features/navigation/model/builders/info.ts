import { type InfoSlug, routes } from '@/shared/config/routes';

import { type INavItemConfig, type NavigationDict } from '../types';

type InfoNavDict = Pick<NavigationDict, 'help' | 'legal'>;

/** Every info page must have a label (compile-time exhaustive). */
const INFO_NAV_LABELS = {
  'privacy-policy': dict => dict.legal.privacy_policy,
  'terms-conditions': dict => dict.legal.terms_conditions,
  'public-offer': dict => dict.help.public_offer,
  faq: dict => dict.help.faq,
  'payment-delivery': dict => dict.help.payment_delivery,
  'returns-exchanges': dict => dict.help.returns_exchanges,
} satisfies Record<InfoSlug, (dict: InfoNavDict) => string>;

/** Sidebar / mobile-menu order. */
const INFO_NAV_ORDER = [
  'privacy-policy',
  'terms-conditions',
  'public-offer',
  'faq',
  'payment-delivery',
  'returns-exchanges',
] as const satisfies readonly InfoSlug[];

export function getInfoNavConfig(dict: InfoNavDict): INavItemConfig[] {
  return INFO_NAV_ORDER.map(slug => ({
    id: slug,
    label: INFO_NAV_LABELS[slug](dict),
    href: routes.info(slug),
  }));
}
