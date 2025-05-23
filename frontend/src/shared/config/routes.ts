//INFO List of static paths
export type ExternalHref = `http${'s' | ''}://${string}`;

const staticRoutes = {
  home: '/' as const,
  about: '/about-us' as const,
  exclusive: '/exclusive' as const,
  collections: '/collections' as const,
  categories: '/categories' as const,
  contacts: '/contacts' as const,
  checkouts: '/checkouts' as const,
  privacy_policy: '/privacy-policy' as const,
  legal_terms: '/legal-terms' as const,
  cookie_policy: '/cookie-policy' as const,
};

//INFO Functions for dynamic routes
const dynamicRoutes = {
  product: (id: string) => `/product/${id}` as const,
  category: (slug: string) => `/categories/${slug}` as const,
  collection: (slug: string) => `/collections/${slug}` as const,
};

//INFO Getting types from static routes
type ValueOf<T> = T[keyof T];
export type StaticRoutes = ValueOf<typeof staticRoutes>;

//INFO Types of dynamic paths (separately hands or generation)

export type DynamicRoutes =
  | ReturnType<typeof dynamicRoutes.product>
  | ReturnType<typeof dynamicRoutes.category>
  | ReturnType<typeof dynamicRoutes.collection>;

//INFO General type
export type AppRoutes = StaticRoutes | DynamicRoutes;

export const routes = {
  ...staticRoutes,
  ...dynamicRoutes,
};
