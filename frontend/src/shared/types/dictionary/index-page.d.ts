type Image = {
  url: string;
  alt: string;
};

type Banner = {
  type: 'hero';
  title: string;
  subTitle: string;
  assets: {
    attributes: Image;
  };
};

type ProductType = {
  id: number;
  title: string;
  images: Image;
};

type Product = {
  id: number;
  type: 'new' | 'recommended';
  title: string;
  productDescription: string;
  badge: 'Most popular' | 'Last' | string;
  images: Image[];
};

type Collection = {
  id: number;
  type: 'new' | 'recommended';
  title: string;
  images: Image;
};

type Feature = {
  icon: string;
  title: string;
  description: string;
};

export type Section = {
  sectionTitle: string;
};

type HeroSection = {
  banners: Banner[];
} & Section;

type ProductTypesSection = {
  productsType: ProductType[];
} & Section;

type NewProductsSection = {
  products: Product[];
} & Section;

type NewCollectionSection = {
  collections: Collection[];
} & Section;

type ExclusiveSection = {
  sectionTitle: string;
  description: string;
  image: Image;
} & Section;

type RecommendedCollectionSection = {
  collections: Collection[];
} & Section;

type RecommendedProductsSection = {
  products: Product[];
} & Section;

type NewsletterSection = {
  image: Image;
} & Section;

type FeaturesSection = {
  features: Feature[];
} & Section;

type IndexPage = {
  hero: HeroSection;
  productTypesSection: ProductTypesSection;
  newProductsSection: NewProductsSection;
  newCollectionSection: NewCollectionSection;
  exclusiveSection: ExclusiveSection;
  recommendedCollectionSection: RecommendedCollectionSection;
  recommendedProductsSection: RecommendedProductsSection;
  newsLetterSection: NewsletterSection;
  featuresSection: FeaturesSection;
};

declare module '@/dictionary/index.json' {
  const value: IndexPage;
  export default value;
}
