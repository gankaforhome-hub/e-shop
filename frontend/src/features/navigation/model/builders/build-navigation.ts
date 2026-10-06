import { type CollectionDTO } from '@/entities/collection';

import { type NavigationDict } from '../types';
import { getHelpNavConfig } from './help';
import { getInfoNavConfig } from './info';
import { getLegalNavConfig } from './legal';
import { getMainNavConfig } from './main';

export { getHelpNavConfig, getLegalNavConfig, getMainNavConfig };

export function buildMainNav(
  dict: NavigationDict['main'],
  collections?: CollectionDTO[],
) {
  return getMainNavConfig(dict, collections);
}

export function buildHelpNav(dict: NavigationDict['help']) {
  return getHelpNavConfig(dict);
}

export function buildLegalNav(dict: NavigationDict['legal']) {
  return getLegalNavConfig(dict);
}

export function buildInfoNav(dict: Omit<NavigationDict, 'aria'>) {
  return getInfoNavConfig(dict);
}
