import { type TBannerSlide } from '../model/types';

export const bannerSlides: TBannerSlide[] = [
  {
    id: '1',
    title: 'Agro',
    subTitle: 'new collection',
    slug: `agro`,
    media: {
      src: '/images/hero_image.webp',
      alt: 'Весняна колекція',
    },
  },
  {
    id: '2',
    title: 'Ptahy',
    subTitle: 'popular collection',
    slug: `ptahy`,
    media: {
      src: '/images/hero_image_2.webp',
      alt: 'Зимова колекція',
    },
  },
  // {
  //   id: '3',
  //   title: 'Осіння колекція',
  //   subTitle: 'popular collection',
  //   slug: `autumn`,
  //   media: {
  //     src: '/videos/pottery_platter.mp4',
  //     poster: '/videos/poster-video.webp',
  //   },
  // },
];
