import { Logger } from '@nestjs/common';
import { StorageClient } from '@supabase/storage-js';
import { IMediaStorage } from '../interfaces/media-storage.interface';

// Content-addressed keys never change content, so browsers and the CDN may keep them for a year
const CACHE_CONTROL_SECONDS = '31536000';

export interface ISupabaseMediaStorageOptions {
  // Project URL, https://<project_ref>.supabase.co; any path is ignored
  url: string;
  // sb_secret_… key: backend only, it bypasses Storage policies
  secretKey: string;
  bucket: string;
}

export class SupabaseMediaStorage implements IMediaStorage {
  private readonly logger = new Logger('MediaStorage');

  constructor(
    private readonly client: StorageClient,
    private readonly bucket: string,
  ) {}

  async put(key: string, buffer: Buffer, contentType: string): Promise<void> {
    const { error } = await this.client.from(this.bucket).upload(key, buffer, {
      contentType,
      upsert: true,
      cacheControl: CACHE_CONTROL_SECONDS,
    });
    if (error) this.fail('put', key, error);
  }

  async remove(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    const { error } = await this.client.from(this.bucket).remove(keys);
    if (error) this.fail('remove', keys.join(', '), error);
  }

  publicUrl(key: string): string {
    return this.client.from(this.bucket).getPublicUrl(key).data.publicUrl;
  }

  //COMMENT logs the message only: the error object may carry request details
  private fail(operation: string, target: string, error: Error): never {
    this.logger.error(`${operation} failed for ${target}: ${error.message}`);
    throw error;
  }
}

// A plain function, so prisma/seed.ts can create the storage without Nest
export function createSupabaseMediaStorage({
  url,
  secretKey,
  bucket,
}: ISupabaseMediaStorageOptions): SupabaseMediaStorage {
  //COMMENT origin only: the Dashboard also shows the URL with a path (/rest/v1/)
  const client = new StorageClient(`${new URL(url).origin}/storage/v1`, {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
  });
  return new SupabaseMediaStorage(client, bucket);
}
