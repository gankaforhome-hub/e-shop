import { type MetadataRoute } from 'next';

/** `/robots.txt`: the admin panel is never crawled. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
  };
}
