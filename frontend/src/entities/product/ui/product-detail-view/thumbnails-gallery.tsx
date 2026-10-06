'use client';

import { type ProductMedia } from '../../model/types';

interface ThumbnailsGalleryProps {
  media: ProductMedia[];
  title: string;
  onSelectMedia: (id: string, index: number) => void;
  activeMediaId?: string;
}
export function ThumbnailsGallery({ media, title }: ThumbnailsGalleryProps) {
  return (
    <div className="relative w-full shrink-0 lg:order-1 lg:w-auto">
      ThumbnailsGallery
    </div>
  );
}
4;
