//INFO Typed internal paths of the CMS, grouped by README block. Locale-agnostic:
//INFO AppLink and the i18n router add the locale prefix.

export type ExternalHref =
  `http${'s' | ''}://${string}` | `mailto:${string}` | `tel:${string}`;

/** In-page anchors (skip link, table of contents). */
export type HashHref = `#${string}`;

export const routes = {
  home: '/',
  marketing: {
    dashboard: '/marketing/dashboard',
    analytics: '/marketing/analytics',
    orders: '/marketing/orders',
    inventory: '/marketing/inventory',
    reports: '/marketing/reports',
  },
  catalog: {
    collections: '/catalog/collections',
    categories: '/catalog/categories',
    products: '/catalog/products',
    attributes: '/catalog/attributes',
  },
  content: {
    banners: '/content/banners',
    pages: '/content/pages',
    blog: '/content/blog',
    forms: '/content/forms',
  },
  settings: '/settings',
  account: '/account',
} as const;

/**
 * Every path of a route tree: string leaves plus the return type of path
 * helpers, so a typed helper such as
 * `product: (id: string) => \`/catalog/products/${id}\` as const`
 * joins `AppRoutes` without touching this type.
 */
type RouteLeaves<T> = T extends string
  ? T
  : T extends (...args: never[]) => infer Path
    ? Path
    : { [Key in keyof T]: RouteLeaves<T[Key]> }[keyof T];

export type AppRoutes = RouteLeaves<typeof routes>;
