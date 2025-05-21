import { BannerSlide } from '../model/types';

export const bannerSlides: BannerSlide[] = [
  {
    id: '1',
    title: 'konyushina',
    subTitle: 'new collection',
    slug: `collections/1`,
    media: {
      type: 'image',
      src: '/images/hero_image.png',
      alt: 'Весняна колекція',
    },
  },
  {
    id: '2',
    title: 'Winter',
    subTitle: 'popular collection',
    slug: `collections/2`,
    media: {
      type: 'image',
      src: '/images/product.png',
      alt: 'Зимова колекція',
    },
  },
  {
    id: '3',
    title: 'Осіння колекція',
    subTitle: 'popular collection',
    slug: `collections/3`,
    media: {
      type: 'video',
      src: '/videos/pottery_platter.mp4',
      poster: '/videos/poster-video.png',
    },
  },
];
