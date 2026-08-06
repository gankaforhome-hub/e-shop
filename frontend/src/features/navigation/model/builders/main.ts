import { type Collection } from '@/entities/collection/model/types';
import { routes } from '@/shared/config/routes';

import { type BuildNavParams, type INavItemConfig } from '../types';

interface BuildMainNavParams extends BuildNavParams {
  collections?: Collection[];
}

export function getMainNavConfig({
  dict,
  collections = [],
}: BuildMainNavParams): INavItemConfig[] {
  const mainDict = dict.main || {};

  const collectionChildren: INavItemConfig[] = [
    {
      id: 'all-collections',
      labelKey: mainDict.collections || 'Collections',
      href: routes.collections,
    },
    ...collections.map(col => ({
      id: col.id,
      labelKey: col.title,
      href: routes.collection(col.slug),
    })),
  ];

  return [
    {
      id: 'collections',
      labelKey: mainDict.collections || 'Collections',
      href: routes.collections,
      children: collectionChildren,
    },
    {
      id: 'allProducts',
      labelKey: mainDict.allProducts || 'All products',
      href: routes.products(),
    },
    {
      id: 'about',
      labelKey: mainDict.about || 'About Us',
      href: routes.about,
    },
    {
      id: 'exclusive',
      labelKey: mainDict.exclusive || 'Exclusive',
      href: routes.exclusive,
    },
    {
      id: 'releases',
      labelKey: mainDict.releases || 'Releases',
      href: routes.releases,
    },
  ];
}
