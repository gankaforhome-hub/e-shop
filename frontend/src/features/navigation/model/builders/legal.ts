import { routes } from '@/shared/config/routes';

import { type BuildNavParams, type INavItemConfig } from '../types';

interface BuildLegalNavParams extends BuildNavParams {}

export function getLegalNavConfig({
  dict,
}: BuildLegalNavParams): INavItemConfig[] {
  const legalDict = dict.legal || {};

  return [
    {
      id: 'terms_conditions',
      labelKey: legalDict.terms_conditions || 'Terms & Conditions',
      href: routes.terms_conditions,
    },
    {
      id: 'privacy_policy',
      labelKey: legalDict.faq || 'Privacy Policy',
      href: routes.faq,
    },
    {
      id: 'cookie_policy',
      labelKey: legalDict.cookie_policy || 'Files Cookie',
      href: routes.cookie_policy,
    },
  ];
}
