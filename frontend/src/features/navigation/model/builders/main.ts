import { type Collection } from '@/entities/collection/model/types';
import { routes } from '@/shared/config/routes';

import { type INavItemConfig, type NavigationDict } from '../types';

export function getMainNavConfig(
  dict: NavigationDict['main'],
  collections: Collection[] = [],
): INavItemConfig[] {
  const collectionChildren: INavItemConfig[] = [
    {
      id: 'all-collections',
      label: dict.collections,
      href: routes.collections,
    },
    ...collections.map(col => ({
      id: col.id,
      label: col.title,
      href: routes.collection(col.slug),
    })),
  ];

  return [
    {
      id: 'collections',
      label: dict.collections,
      href: routes.collections,
      children: collectionChildren,
    },
    {
      id: 'allProducts',
      label: dict.allProducts,
      href: routes.products(),
    },
    {
      id: 'about',
      label: dict.about,
      href: routes.about,
    },
    {
      id: 'exclusive',
      label: dict.exclusive,
      href: routes.exclusive,
    },
    {
      id: 'releases',
      label: dict.releases,
      href: routes.releases,
    },
  ];
}
