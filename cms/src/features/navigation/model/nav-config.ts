import { CMS_ROLES, type CmsRole } from '@/entities/user';
import { routes, type AppRoutes } from '@/shared/config';
import { type SectionGroupId, type SectionKeyOf } from '@/shared/i18n/types';
import { type IconName } from '@/shared/ui/icon';

type NavItemOf<Group extends SectionGroupId> = {
  /** Dictionary key: label = `sections.<section>.title`. */
  section: SectionKeyOf<Group>;
  href: AppRoutes;
  icon: IconName;
  /** Overrides the block's `roles` for this item (README → RBAC). */
  roles?: readonly CmsRole[];
};

/**
 * A sidebar block. Items must belong to the block's own dictionary group
 * (`content.*` under `content`), so a misplaced item fails type checking.
 */
export type NavGroup<Group extends SectionGroupId = SectionGroupId> =
  Group extends SectionGroupId
    ? {
        id: Group;
        icon: IconName;
        /** Roles that see the block's items besides `admin` (README → RBAC). */
        roles: readonly CmsRole[];
        items: readonly NavItemOf<Group>[];
      }
    : never;

export type NavItem = NavGroup['items'][number];

/** A block as rendered: items already filtered for the current role. */
export type NavBlock = {
  id: SectionGroupId;
  icon: IconName;
  items: readonly NavItem[];
};

/** Sidebar blocks in priority order: overview, marketing, catalog, content. */
export const NAV_BLOCKS = [
  {
    id: 'overview',
    icon: 'overview',
    roles: CMS_ROLES,
    items: [{ section: 'overview.home', href: routes.home, icon: 'overview' }],
  },
  {
    id: 'marketing',
    icon: 'marketing',
    roles: ['order-manager'],
    items: [
      {
        section: 'marketing.dashboard',
        href: routes.marketing.dashboard,
        icon: 'dashboard',
      },
      {
        section: 'marketing.analytics',
        href: routes.marketing.analytics,
        icon: 'analytics',
      },
      {
        section: 'marketing.orders',
        href: routes.marketing.orders,
        icon: 'orders',
      },
      {
        section: 'marketing.inventory',
        href: routes.marketing.inventory,
        icon: 'inventory',
        roles: ['order-manager', 'catalog-manager'],
      },
      {
        section: 'marketing.reports',
        href: routes.marketing.reports,
        icon: 'reports',
      },
    ],
  },
  {
    id: 'catalog',
    icon: 'catalog',
    roles: ['catalog-manager'],
    items: [
      {
        section: 'catalog.collections',
        href: routes.catalog.collections,
        icon: 'collections',
      },
      {
        section: 'catalog.categories',
        href: routes.catalog.categories,
        icon: 'categories',
      },
      {
        section: 'catalog.products',
        href: routes.catalog.products,
        icon: 'products',
      },
      {
        section: 'catalog.attributes',
        href: routes.catalog.attributes,
        icon: 'attributes',
      },
    ],
  },
  {
    id: 'content',
    icon: 'content',
    roles: ['content-editor'],
    items: [
      {
        section: 'content.banners',
        href: routes.content.banners,
        icon: 'banners',
      },
      { section: 'content.pages', href: routes.content.pages, icon: 'pages' },
      { section: 'content.blog', href: routes.content.blog, icon: 'blog' },
      { section: 'content.forms', href: routes.content.forms, icon: 'forms' },
    ],
  },
] as const satisfies readonly NavGroup[];

/** Bottom of the sidebar, for every role. */
export const SYSTEM_NAV = {
  id: 'system',
  icon: 'settings',
  roles: CMS_ROLES,
  items: [
    { section: 'system.settings', href: routes.settings, icon: 'settings' },
    { section: 'system.account', href: routes.account, icon: 'account' },
  ],
} as const satisfies NavGroup;
