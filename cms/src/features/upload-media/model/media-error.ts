/** Keys of `media.errors` in the dictionaries. */
export type MediaErrorKey =
  | 'tooLarge'
  | 'unsupportedType'
  | 'invalidFile'
  | 'forbidden'
  | 'tooManyRequests'
  | 'serverError';

/** The API accepts up to 10 MB per file (`MEDIA_MAX_UPLOAD_BYTES`); Server Actions share that limit. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const MEDIA_ALT_MAX_LENGTH = 250;
