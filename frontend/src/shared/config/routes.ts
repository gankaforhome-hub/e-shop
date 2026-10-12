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
  cart: '/cart' as const,
  checkouts: '/checkouts' as const,
  account: '/account' as const,
  wishlist: '/wishlist' as const,
};

export const categorySlugs = [
  'plates',
  'sets',
  'kettles',
  'cups',
  'candlesticks',
  'glass',
] as const;

export type CategorySlug = (typeof categorySlugs)[number];

export const isCategorySlug = (value: unknown): value is CategorySlug =>
  typeof value === 'string' &&
  (categorySlugs as readonly string[]).includes(value);

export const productSortOptions = ['price', 'name'] as const;

export type ProductSort = (typeof productSortOptions)[number];

export const isProductSort = (value: unknown): value is ProductSort =>
  typeof value === 'string' &&
  (productSortOptions as readonly string[]).includes(value);

export const InfoSlugs = [
  'faq',
  'delivery',
  'returns',
  'payments',
  'privacy-policy',
  'terms-conditions',
  'cookie-policy',
] as const;

export type InfoSlug = (typeof InfoSlugs)[number];

export const isInfoSlug = (value: unknown): value is InfoSlug =>
  typeof value === 'string' && (InfoSlugs as readonly string[]).includes(value);

type ProductsRoute = '/products' | `/products?${string}`;

type ProductsSearchParams = {
  category?: CategorySlug | undefined;
  sort?: ProductSort | undefined;
  page?: string | undefined;
  search?: string | undefined;
};

//INFO Functions for dynamic routes
export const dynamicRoutes = {
  info: (infoSlug: InfoSlug) => `/info/${infoSlug}` as const,
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

export function createRoute(path: string): AppRoutes {
  return path as AppRoutes;
}
