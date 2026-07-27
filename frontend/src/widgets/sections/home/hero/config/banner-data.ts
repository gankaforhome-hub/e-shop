import { type BannerSlide } from '../model/types';

export const bannerSlides: BannerSlide[] = [
  {
    id: '1',
    title: 'Agro',
    subTitle: 'new collection',
    slug: `agro`,
    media: {
      type: 'image',
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
      type: 'image',
      src: '/images/hero_image_2.png',
      alt: 'Зимова колекція',
    },
  },
  // {
  //   id: '3',
  //   title: 'Осіння колекція',
  //   subTitle: 'popular collection',
  //   slug: `autumn`,
  //   media: {
  //     type: 'video',
  //     src: '/videos/pottery_platter.mp4',
  //     poster: '/videos/poster-video.webp',
  //   },
  // },
];
