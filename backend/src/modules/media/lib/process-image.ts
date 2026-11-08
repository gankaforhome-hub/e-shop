import { createHash } from 'node:crypto';
import sharp, { type Metadata, type Sharp } from 'sharp';
import {
  MEDIA_ALLOWED_FORMATS,
  MEDIA_BLUR_WIDTH,
  MEDIA_LIMIT_INPUT_PIXELS,
  MEDIA_VARIANT_WIDTHS,
  MEDIA_WEBP_QUALITY,
} from '../media.constants';

// Plain module without Nest: prisma/seed.ts imports it by a relative path

export class UnsupportedImageError extends Error {
  constructor(reason: string) {
    super(`Unsupported image: ${reason}`);
    this.name = 'UnsupportedImageError';
  }
}

export interface IImageVariant {
  width: number;
  height: number;
  buffer: Buffer;
}

export interface IProcessedImage {
  // SHA-256 of the original buffer, hex
  checksum: string;
  // Size of the largest variant
  width: number;
  height: number;
  // Narrowest first
  variants: IImageVariant[];
  blurDataUrl: string;
}

const isAllowedFormat = (format: string) =>
  (MEDIA_ALLOWED_FORMATS as readonly string[]).includes(format);

async function readMetadata(image: Sharp): Promise<Metadata> {
  try {
    return await image.metadata();
  } catch {
    throw new UnsupportedImageError('unreadable file');
  }
}

function assertSupported(meta: Metadata) {
  if (!isAllowedFormat(meta.format)) {
    throw new UnsupportedImageError(meta.format);
  }
  // HEIC (hevc) shares the heif decoder, but prebuilt sharp can't decode it
  if (meta.format === 'heif' && meta.compression !== 'av1') {
    throw new UnsupportedImageError('heic');
  }
  if ((meta.pages ?? 1) > 1) {
    throw new UnsupportedImageError('animated or multi-page');
  }
  if (meta.width * meta.height > MEDIA_LIMIT_INPUT_PIXELS) {
    throw new UnsupportedImageError('too many pixels');
  }
}

//COMMENT the largest variant is the original width (capped at 1920), so a 570 px
//original keeps 570 px instead of dropping to 320; standard widths fill in below it
function pickWidths(originalWidth: number): number[] {
  const largest = Math.min(
    originalWidth,
    MEDIA_VARIANT_WIDTHS[MEDIA_VARIANT_WIDTHS.length - 1],
  );
  const smaller = MEDIA_VARIANT_WIDTHS.filter(width => width < largest);
  return [...smaller, largest];
}

// SHA-256 of the original file, hex: the identity of a Media row
export function imageChecksum(buffer: Buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

/**
 * Turns an uploaded image into WebP variants and a blur placeholder.
 * The format is read from the file itself, never from the MIME type or name.
 * Output carries no metadata (EXIF, GPS); orientation is applied first.
 * Variants are encoded one by one to keep peak memory low on large inputs.
 */
export async function processImage(buffer: Buffer): Promise<IProcessedImage> {
  const checksum = imageChecksum(buffer);
  const image = sharp(buffer, {
    limitInputPixels: MEDIA_LIMIT_INPUT_PIXELS,
  }).rotate();

  const meta = await readMetadata(image);
  assertSupported(meta);

  const variants: IImageVariant[] = [];
  for (const width of pickWidths(meta.autoOrient.width)) {
    const { data, info } = await image
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: MEDIA_WEBP_QUALITY })
      .toBuffer({ resolveWithObject: true });
    variants.push({ width: info.width, height: info.height, buffer: data });
  }

  const blur = await image
    .clone()
    .resize({ width: MEDIA_BLUR_WIDTH })
    .webp({ quality: MEDIA_WEBP_QUALITY })
    .toBuffer();

  const largest = variants[variants.length - 1];
  return {
    checksum,
    width: largest.width,
    height: largest.height,
    variants,
    blurDataUrl: `data:image/webp;base64,${blur.toString('base64')}`,
  };
}
