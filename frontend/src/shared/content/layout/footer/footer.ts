import { type AppRoutes, type ExternalHref } from '@/shared/config';
import { type IconName, type SocialLink } from '@/shared/types';

export interface FooterLink {
  label: string;
  href: AppRoutes;
}

export const footerData = {
  brand: {
    name: 'Ganka For Home',
  },
  contacts: [
    {
      href: 'tel:+380635854678',
      icon: 'phone',
      label: '+38 (063) 585-46-78',
    },
    {
      href: 'mailto:gankaforhome@gmail.com',
      icon: 'email',
      label: 'gankaforhome@gmail.com',
    },
  ] as { href: ExternalHref; icon: IconName; label: string }[],
  shopLinks: [
    { label: 'Collections', href: '/collections' },
    { label: 'All products', href: '/products' },
    { label: 'About Us', href: '/about' },
    { label: 'Exclusive', href: '/exclusive' },
    { label: 'Releases', href: '/releases' },
  ] satisfies FooterLink[],
  helpLinks: [
    { label: 'Contact Us', href: '/contacts' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Payments', href: '/payments' },
    { label: 'Delivery', href: '/delivery' },
    { label: 'Returns', href: '/returns' },
  ] satisfies FooterLink[],
  socialLinks: [
    { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  ] as SocialLink[],
  paymentMethods: [
    { label: 'Mastercard', icon: 'mastercard' },
    { label: 'Visa', icon: 'visa' },
    { label: 'LiqPay', icon: 'liqpay' },
    { label: 'Apple Pay', icon: 'applepay' },
    { label: 'Google Pay', icon: 'googlepay' },
  ] as { label: string; icon: IconName }[],
  legalLinks: [
    { label: 'Terms & Conditions', href: '/terms-conditions' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Files Cookie', href: '/cookie-policy' },
  ] satisfies FooterLink[],
};
