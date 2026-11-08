export type ImagePosition = 'left' | 'right';

export type Media = {
  id?: string;
  src: string;
  alt?: string;
  poster?: string;
  objectFit?: 'cover' | 'contain';
  backgroundColor?: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
  /** CSS `object-position`, e.g. `50% 20%` (focal point from the CMS) */
  objectPosition?: string;
};
