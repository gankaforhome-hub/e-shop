/** Longest side after compression. The API stores variants up to 1920 px, so more is wasted. */
export const MAX_IMAGE_SIDE = 1920;
/** Files up to this size are sent as they are when their dimensions are fine. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const WEBP_QUALITY = 0.92;
// Vector and animated formats can't be redrawn on a canvas without losing what they are
const UNTOUCHED_TYPES: readonly string[] = ['image/svg+xml', 'image/gif'];

/** Fits the longest side into `maxSide`, keeping the aspect ratio. Never enlarges. */
export function getScaledSize(
  width: number,
  height: number,
  maxSide: number = MAX_IMAGE_SIDE,
): { width: number; height: number } {
  const scale = Math.min(1, maxSide / Math.max(width, height));

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Only an image that is too large (in pixels or bytes) is worth re-encoding. */
export function needsCompression(
  { width, height, size }: { width: number; height: number; size: number },
  maxSide: number = MAX_IMAGE_SIDE,
  maxBytes: number = MAX_IMAGE_BYTES,
): boolean {
  return Math.max(width, height) > maxSide || size > maxBytes;
}

const toWebpName = (name: string) => `${name.replace(/\.[^./\\]+$/, '')}.webp`;

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob | null>(resolve =>
    canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY),
  );

/**
 * Shrinks a photo in the browser before it is uploaded: WebP at quality 0.92, longest side
 * up to 1920 px. A file that is already small enough, SVG, GIF and anything the browser can't
 * decode are returned as they are (the API accepts or rejects those itself). Redrawing on a
 * canvas applies the EXIF orientation and drops the metadata.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || UNTOUCHED_TYPES.includes(file.type)) {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    // Explicit fields: `width` and `height` are prototype getters, a spread would drop them
    const source = {
      width: bitmap.width,
      height: bitmap.height,
      size: file.size,
    };
    if (!needsCompression(source)) {
      return file;
    }

    const { width, height } = getScaledSize(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, width, height);

    const blob = await canvasToBlob(canvas);
    // A browser without WebP encoding falls back to PNG: that would be larger, keep the file
    if (blob?.type !== 'image/webp') {
      return file;
    }

    return new File([blob], toWebpName(file.name), { type: 'image/webp' });
  } finally {
    bitmap.close();
  }
}
