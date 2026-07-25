import { type BannerSlide } from '../model/types';

export const bannerSlides: BannerSlide[] = [
  {
    id: '1',
    title: 'konyushina',
    subTitle: 'new collection',
    slug: `konyushina`,
    media: {
      type: 'image',
      src: '/images/hero_image.webp',
      alt: 'Весняна колекція',
    },
  },
  {
    id: '2',
    title: 'Winter',
    subTitle: 'popular collection',
    slug: `winter`,
    media: {
      type: 'image',
      src: '/images/product.webp',
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
