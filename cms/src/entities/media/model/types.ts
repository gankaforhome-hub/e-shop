/*
 * Responses of `/admin/media`, written by hand from Swagger
 * (backend `modules/media/responses/media.response.ts`). Dates arrive as ISO strings.
 */

/** `AdminMediaVariantResponse` */
export type MediaVariant = {
  width: number;
  height: number;
  /** Bytes */
  size: number;
  key: string;
  publicUrl: string;
};

/** `CropDataResponse`: fractions of the original, 0..1. */
export type MediaCropData = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** `MediaResponse` */
export type Media = {
  id: string;
  checksum: string;
  width: number;
  height: number;
  sizeBytes: number;
  /** Narrowest first */
  variants: MediaVariant[];
  blurDataUrl: string | null;
  alt: string | null;
  originalName: string | null;
  /** 0 (left) .. 1 (right) */
  focalX: number;
  /** 0 (top) .. 1 (bottom) */
  focalY: number;
  /** CSS `object-position` derived from the focal point */
  objectPosition: string;
  cropData: MediaCropData | null;
  createdAt: string;
  updatedAt: string;
};

/** `MediaListResponse` */
export type MediaList = {
  items: Media[];
  total: number;
};

/** `UpdateMediaDto`: every field optional; `alt: null` clears the text. */
export type UpdateMediaInput = {
  alt?: string | null;
  focalX?: number;
  focalY?: number;
  cropData?: MediaCropData | null;
};
