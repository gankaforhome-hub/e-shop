import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';

export type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

export type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
  isAutoplay?: boolean;
  isFade?: boolean;
};

export type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (to: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  current: number;
  isPaused: boolean;
  slideCount: number;
  isInitialize: boolean;
} & CarouselProps;
