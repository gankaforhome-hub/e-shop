import { type ExternalHref, type RouteValue } from '@/shared/config/routes';
import { type IconName, type IconT } from '@/shared/types';

export type ImageAsset = {
  src: string;
  alt: string;
};

export type Logo = {
  icon: Extract<IconName, 'logoFull' | 'logoMin'>;
  href: string;
  ariaLabel: string;
};

export type Contact = {
  icon: Extract<IconName, 'phone' | 'email'>;
  href: RouteValue;
  text: string;
  ariaLabel: string;
};

export type NavItem = {
  id: string;
  title: string;
  href: Extract<
    RouteValue,
    '/collections' | '/products' | '/about-us' | '/exclusive'
  >;
  ariaLabel: string;
};

export type SocialLink = {
  icon: Extract<IconName, 'telegram' | 'facebook' | 'instagram' | 'location'>;
  label: string;
  href: ExternalHref;
};

export type PaymentIcon = {
  icon: Extract<
    IconName,
    'mastercard' | 'visa' | 'paypal' | 'applepay' | 'googlepay' | 'liqpay'
  >;
  ariaLabel: string;
};

//Header types
type Submenu = {
  subTittle: string;
  subDescription: string;
  subNav: IconT[];
};

type NavIconItem = IconT & {
  submenu?: Submenu;
};

type NavIcon = {
  contactUs: NavIconItem;
  language: NavIconItem;
  favorite: NavIconItem;
};

export type TopBar = {
  socialLink: SocialLink[];
  logo: Logo;
  navIcon: NavIcon;
  basket: IconT;
};

export type Header = {
  topBar: TopBar;
  navMenu: NavItem[];
};

//Footer types
export type UnderFooterServiceT = {
  id: number;
  title: string;
  href: Extract<
    RouteValue,
    '/terms-conditions' | '/privacy-policy' | '/cookie-policy'
  >;
  ariaLabel: string;
};

export type UnderFooterT = {
  copyright: {
    icon: Extract<IconName, 'copyright'>;
    yearStart: string;
    TM: string;
  };
  logo: Logo;
  services: UnderFooterServiceT[];
};

export type FooterT = {
  contacts: {
    title: string;
    description: string;
    navContacts: Contact[];
  };
  nav: {
    title: string;
    navMenu: NavItem[];
  };
  social: {
    title: string;
    socialLink: SocialLink[];
  };
  customerService: {
    title: string;
    navCustomerService: NavItem[];
  };
  payments: {
    title: string;
    paymentIcons: PaymentIcon[];
  };
};

export type CommonPage = {
  header: Header;
  footer: FooterT;
};
declare module '@/dictionary/common.json' {
  const value: CommonPage;
  export default value;
}
