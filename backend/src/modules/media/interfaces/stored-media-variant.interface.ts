// One element of Media.variants (Json), narrowest first
export interface IStoredMediaVariant {
  width: number;
  height: number;
  // Bytes
  size: number;
  // Storage key, media/<checksum>/<width>.webp
  key: string;
}
