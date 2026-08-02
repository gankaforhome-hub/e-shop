import { type ImagePosition } from '@/shared/types';

export const mapImagePosition = <
  T extends { panel: { imagePosition: string } },
>(
  data: T,
) => ({
  ...data,
  panel: {
    ...data.panel,
    imagePosition: data.panel.imagePosition as ImagePosition,
  },
});
