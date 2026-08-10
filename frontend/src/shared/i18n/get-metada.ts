import { isValidLocale } from './helpers';
import { type MetadataDict, type MetadataName } from './types';

export async function getMetadata<P extends MetadataName>(
  page: P,
  locale: string,
): Promise<MetadataDict<P>> {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale provided to getMetadata: ${locale}`);
  }

  return (await import(`@/dictionaries/${locale}/metadata/${page}.json`))
    .default;
}

export interface IGetMetadataProps {
  params: Promise<{ lang: string }>;
}
