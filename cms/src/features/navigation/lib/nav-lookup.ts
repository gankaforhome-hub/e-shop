import { canAccess, type CmsRole } from '@/entities/user';
import { type SectionGroupId, type SectionKey } from '@/shared/i18n/types';

import {
  NAV_BLOCKS,
  SYSTEM_NAV,
  type NavBlock,
  type NavGroup,
  type NavItem,
} from '../model/nav-config';

/** Blocks with the items `role` may open; blocks left empty are dropped. */
export function getNavBlocks(role: CmsRole): readonly NavBlock[] {
  return NAV_BLOCKS.flatMap((block: NavGroup) => {
    const items = block.items.filter((item: NavItem) =>
      canAccess(role, item.roles ?? block.roles),
    );

    return items.length > 0 ? [{ id: block.id, icon: block.icon, items }] : [];
  });
}

/** Block and nav item of a section: page eyebrows and empty-state icons. */
export function findNavItem(
  section: SectionKey,
): { group: SectionGroupId; item: NavItem } | undefined {
  for (const group of [...NAV_BLOCKS, SYSTEM_NAV]) {
    const item = group.items.find(entry => entry.section === section);
    if (item) {
      return { group: group.id, item };
    }
  }

  return undefined;
}
