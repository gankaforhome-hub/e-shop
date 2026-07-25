export type BannerSlide = {
  id: string;
  title: string;
  subTitle?: string;
  slug: string;
  media: {
    type: 'image' | 'video';
    src: string;
    alt?: string;
    poster?: string;
  };
};
