import { type MetadataRoute } from 'next';

import { isIndexingAllowed } from '@/shared/config/indexing';

/** `/robots.txt`: blocks every crawler until `ALLOW_INDEXING=true`. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isIndexingAllowed
      ? { userAgent: '*', allow: '/' }
      : { userAgent: '*', disallow: '/' },
  };
}
