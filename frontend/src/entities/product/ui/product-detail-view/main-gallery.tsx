'use client';
import { cn } from 'cn';

import { type ProductMedia } from '../../model/types';

interface MainGalleryProps {
  media: ProductMedia[];
  title: string;
  activeMediaId?: string;
  //   api?: CarouselApi;
  //   setApi: (api: CarouselApi) => void;
  onSelectMedia: (id: string, index: number) => void;
  className?: string;
}
export function MainGallery({ media, title, className }: MainGalleryProps) {
  // Берємо вибраний слайд напряму з контексту каруселі

  return (
    <div className={cn('relative aspect-square w-full lg:order-2', className)}>
      MainGallery
    </div>
  );
}
