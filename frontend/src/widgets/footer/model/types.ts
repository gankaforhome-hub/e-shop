import type { FooterT } from '@/shared/types';

type FooterSectionKey = keyof Pick<
  FooterT,
  'contacts' | 'nav' | 'customerService' | 'social' | 'payments'
>;

type FooterSectionItems<T> = {
  [K in keyof T]: K extends 'title' | 'description' ? never : K;
}[keyof T];

export type SectionConfig<T extends FooterSectionKey> = {
  type: T;
  title?: FooterT[T]['title'];
  description?: FooterT[T] extends { description: string } ? string : never;
  items: FooterSectionItems<FooterT[T]> extends keyof FooterT[T]
    ? FooterT[T][FooterSectionItems<FooterT[T]>]
    : never;
  className?: string;
  classNameLi?: string;
};
