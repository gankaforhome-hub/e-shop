import { type AdminCollection } from '../model/types';

// List thumbnails are 48 px: the narrowest variant twice as wide covers 2x screens
const THUMB_MIN_WIDTH = 96;

/** The smallest cover variant that is sharp in a list row, or `undefined` without a cover. */
export const getCoverThumbnail = ({ coverImage }: AdminCollection) =>
  coverImage?.variants.find(variant => variant.width >= THUMB_MIN_WIDTH) ??
  coverImage?.variants.at(-1);
