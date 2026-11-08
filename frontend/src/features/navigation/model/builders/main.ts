import { type CollectionDTO } from '@/entities/collection';
import { routes } from '@/shared/config/routes';

import { type INavItemConfig, type NavigationDict } from '../types';

export function getMainNavConfig(
  dict: NavigationDict['main'],
  collections: CollectionDTO[] = [],
): INavItemConfig[] {
  const collectionChildren: INavItemConfig[] = [
    {
      id: 'all-collections',
      label: dict.allCollections, // <- Береться переклад "All Collections" / "Всі колекції"
      href: routes.collections,
    },
    ...collections.map(col => ({
      // Slug, not the API uuid: the storefront identifies collections by slug
      id: `collection-${col.slug}`,
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
