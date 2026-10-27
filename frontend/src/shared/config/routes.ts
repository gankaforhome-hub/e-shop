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
  checkout: '/checkout' as const,
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

export const productSortOptions = [
  'newest',
  'price_asc',
  'price_desc',
] as const;

export type ProductSort = (typeof productSortOptions)[number];

export const isProductSort = (value: unknown): value is ProductSort =>
  typeof value === 'string' &&
  (productSortOptions as readonly string[]).includes(value);

export const InfoSlugs = [
  'faq',
  'payment-delivery',
  'returns-exchanges',
  'public-offer',
  'privacy-policy',
  'terms-conditions',
] as const;

export type InfoSlug = (typeof InfoSlugs)[number];

export const isInfoSlug = (value: unknown): value is InfoSlug =>
  typeof value === 'string' && (InfoSlugs as readonly string[]).includes(value);

type ProductsRoute = '/products' | `/products?${string}`;

export type ProductsSearchParams = {
  category?: CategorySlug | undefined;
  sort?: ProductSort | undefined;
  page?: string | undefined;
  search?: string | undefined;
  favoritesOnly?: 'true' | undefined;
  /** Catalog filters, already serialized and validated by `@/entities/product`. */
  filters?: Readonly<Record<string, string>> | undefined;
};

//INFO Route handlers (not pages: no locale prefix, never passed to AppLink)
export const apiRoutes = {
  checkout: '/api/checkout',
  leads: '/api/leads',
  cartTitles: '/api/cart/titles',
} as const;

//INFO Functions for dynamic routes
export const dynamicRoutes = {
  info: (infoSlug: InfoSlug) => `/info/${infoSlug}` as const,
  /** `variantSku` preselects a SKU on the product page (`?variant=`). */
  product: (productSlug: string, variantSku?: string) =>
    variantSku
      ? (`/product/${productSlug}?variant=${encodeURIComponent(variantSku)}` as const)
      : (`/product/${productSlug}` as const),
  /** Confirmation screen; also the LiqPay `result_url` return target. */
  checkoutSuccess: (orderId?: string) =>
    orderId
      ? (`/checkout/success?orderId=${encodeURIComponent(orderId)}` as const)
      : ('/checkout/success' as const),
  collection: (collectionSlug: string) =>
    `/collection/${collectionSlug}` as const,
  products: (params?: ProductsSearchParams) => {
    if (!params) {
      return '/products' as const;
    }

    const { filters, ...rest } = params;
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...rest, ...filters })) {
      if (value) {
        query.set(key, value);
      }
    }
    const queryString = query.toString();

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
