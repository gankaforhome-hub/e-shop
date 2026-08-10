import fs from 'node:fs/promises';
import path from 'node:path';

import { cache } from 'react';

import { getPlaiceholder } from 'plaiceholder';
import 'server-only';

export const getBlurPlaceholder = cache(async (src: string) => {
  try {
    let buffer: Buffer;

    if (src.startsWith('http://') || src.startsWith('https://')) {
      const res = await fetch(src);
      if (!res.ok) {
        return undefined;
      }
      const arrayBuffer = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      const filePath = path.join(process.cwd(), 'public', src);
      buffer = await fs.readFile(filePath);
    }

    const { base64 } = await getPlaiceholder(buffer);

    // Цей лог тепер викличеться максимум 1 раз для кожного src!
    console.log('🚀 ~ Generated blurDataURL for:', src);

    return base64;
  } catch (error) {
    console.error('Failed to generate blur placeholder for:', src, error);
    return undefined;
  }
});
