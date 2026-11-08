export const MEDIA_STORAGE = 'MEDIA_STORAGE';

export interface IMediaStorage {
  // Overwrites an existing object: keys are content-addressed, so it's the same file
  put(key: string, buffer: Buffer, contentType: string): Promise<void>;
  remove(keys: string[]): Promise<void>;
  publicUrl(key: string): string;
}
