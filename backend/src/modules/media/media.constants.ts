// Responsive widths below the original; the original width itself is the top variant,
// capped at 1920 px
export const MEDIA_VARIANT_WIDTHS = [320, 640, 960, 1280, 1920] as const;

export const MEDIA_WEBP_QUALITY = 80;

// Rejects decompression bombs before the pixels are decoded
export const MEDIA_LIMIT_INPUT_PIXELS = 40_000_000;

// Width of the inline blur placeholder
export const MEDIA_BLUR_WIDTH = 16;

// Decoders accepted by sharp's metadata().format; heif is AVIF only (see processImage)
export const MEDIA_ALLOWED_FORMATS = ['jpeg', 'png', 'webp', 'heif'] as const;

// Upload limits (CMS). The client compresses first, so 10 MB leaves room for raw photos
export const MEDIA_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MEDIA_ALT_MAX_LENGTH = 250;
export const MEDIA_ORIGINAL_NAME_MAX_LENGTH = 255;

// Media library paging
export const MEDIA_PAGE_DEFAULT_TAKE = 20;
export const MEDIA_PAGE_MAX_TAKE = 50;
