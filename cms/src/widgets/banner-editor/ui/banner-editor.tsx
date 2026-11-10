'use client';

import { BannerForm, type BannerFormProps } from '@/features/banner-editor';
import { MediaField } from '@/features/upload-media';

/** The banner form with the image upload plugged in (features don't import each other). */
export function BannerEditor(props: Omit<BannerFormProps, 'ImageField'>) {
  return <BannerForm {...props} ImageField={MediaField} />;
}
