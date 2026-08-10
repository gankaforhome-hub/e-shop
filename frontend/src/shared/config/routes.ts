//INFO List of static paths

export type ExternalHref =
  `http${'s' | ''}://${string}` | `mailto:${string}` | `tel:${string}`;

export const staticRoutes = {
  home: '/' as const,
  collections: '/collections' as const,
  about: '/about' as const,
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
  account: '/account' as const,
  wishlist: '/wishlist' as const,
};

export type CategorySlug =
  'plates' | 'sets' | 'kettles' | 'cups' | 'candlesticks' | 'glass';

type ProductsRoute = '/products' | `/products?${string}`;

type ProductsSearchParams = {
  category?: CategorySlug | undefined;
  sort?: 'price' | 'name' | undefined;
  page?: string | undefined;
  search?: string | undefined;
};

//INFO Functions for dynamic routes
export const dynamicRoutes = {
  product: (productSlug: string) => `/product/${productSlug}` as const,
  collection: (collectionSlug: string) =>
    `/collection/${collectionSlug}` as const,
  products: (params?: ProductsSearchParams) => {
    if (!params) {
      return '/products' as const;
    }

    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '',
      ),
    );

    const queryString = new URLSearchParams(
      cleanParams as Record<string, string>,
    ).toString();

    return (
      queryString ? `/products?${queryString}` : '/products'
    ) as ProductsRoute;
  },
};

//INFO Getting types from static routes
type ValueOf<T> = T[keyof T];
export type StaticRoutes = ValueOf<typeof staticRoutes>;

//INFO Types of dynamic paths (separately hands or generation)
export type DynamicRoutes = ReturnType<ValueOf<typeof dynamicRoutes>>;

// export type DynamicRoutes =
//   | ReturnType<typeof dynamicRoutes.product>
//   | ReturnType<typeof dynamicRoutes.collection>
//   | ReturnType<typeof dynamicRoutes.products>;

//INFO General type
export type AppRoutes = StaticRoutes | DynamicRoutes;

export const routes = {
  ...staticRoutes,
  ...dynamicRoutes,
};

export type RouteValue = (typeof staticRoutes)[keyof typeof staticRoutes];
