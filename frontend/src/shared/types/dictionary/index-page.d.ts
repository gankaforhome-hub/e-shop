import { type IconName, type IconT, type Media } from '@/shared/types';

type VideoPlayerControls = {
  play: IconT;
  pause: IconT;
  mute: IconT;
  sound: IconT;
};

type Section = {
  sectionTitle: string;
};

type Image = {
  url: string;
  alt: string;
};

type BannerSlide = {
  id: string;
  title: string;
  subTitle?: string;
  slug: string;
  media: Media;
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
  icon: IconName;
  title: string;
  description: string;
};

type HeroSection = {
  banners: BannerSlide[];
  videoPlayerControls: VideoPlayerControls;
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

type SubscribeFormField = {
  name: firstName | emailSubscription;
  type: 'email' | 'text';
  label: string;
  placeholder: string;
};

type Notifications = {
  success: {
    title: string;
    text: string;
  };
  error: string;
};

type FormSubscribe = {
  inputs: SubscribeFormField[];
  buttonText: string;
  notifications: Notifications;
};

type NewsletterSection = {
  description: string;
  form: FormSubscribe;
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
