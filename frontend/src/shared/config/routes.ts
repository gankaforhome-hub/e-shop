//INFO List of static paths
export type ExternalHref =
  `http${'s' | ''}://${string}` | `mailto:${string}` | `tel:${string}`;

const staticRoutes = {
  home: '/' as const,
  collections: '/collections' as const,
  products: '/products' as const,
  about: '/about-us' as const,
  exclusive: '/exclusive' as const,
  releases: '/releases' as const,
  contacts: '/contacts' as const,
  faq: '/faq' as const,
  delivery: '/delivery' as const,
  returns: '/returns' as const,
  payments: '/payments' as const,
  privacy_policy: '/privacy-policy' as const,
  terms_conditions: '/terms-conditions' as const,
  cookie_policy: '/cookie-policy' as const,
  checkouts: '/checkouts' as const,
};

//INFO Functions for dynamic routes
const dynamicRoutes = {
  product: (productSlug: string) => `/product/${productSlug}` as const,
  collection: (collectionSlug: string) =>
    `/collection/${collectionSlug}` as const,
};

//INFO Getting types from static routes
type ValueOf<T> = T[keyof T];
export type StaticRoutes = ValueOf<typeof staticRoutes>;

//INFO Types of dynamic paths (separately hands or generation)

export type DynamicRoutes =
  | ReturnType<typeof dynamicRoutes.product>
  | ReturnType<typeof dynamicRoutes.collection>;

//INFO General type
export type AppRoutes = StaticRoutes | DynamicRoutes;

export const routes = {
  ...staticRoutes,
  ...dynamicRoutes,
};

export type RouteValue = (typeof staticRoutes)[keyof typeof staticRoutes];
