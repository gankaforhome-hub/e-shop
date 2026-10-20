import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { getMetadata, type IGetMetadataProps } from '@/shared/i18n/get-metada';
import { isValidLocale } from '@/shared/i18n/helpers';
import { buildMetadata } from '@/shared/i18n/helpers/build-metadata';
import { parseAboutDictionary } from '@/shared/i18n/schemas/about.schema';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import {
  AboutHeroSection,
  ArtOfLivingSection,
  CitronelleMapSection,
  GankaGallerySection,
  ManifestoSection,
  OurStorySection,
  OurValuesSection,
} from '@/widgets/sections/about-us';

interface IAboutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: IGetMetadataProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const meta = await getMetadata('about', lang);

  return buildMetadata({
    meta,
    lang,
    path: routes.about,
  });
}

export default async function AboutPage({ params }: IAboutPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { about } = await getDictionary(['about'], lang);
  const {
    aboutHero,
    manifesto,
    artOfLiving,
    values,
    artistGallery,
    ourStory,
    citronelle,
  } = parseAboutDictionary(about);

  // Philosophy → craft → values → media showcase → where to buy
  return (
    <>
      <Breadcrumbs spacing="editorial" />
      <AboutHeroSection {...aboutHero} />
      <ManifestoSection {...manifesto} />
      <ArtOfLivingSection {...artOfLiving} />
      <OurValuesSection {...values} />
      <GankaGallerySection {...artistGallery} />
      <OurStorySection {...ourStory} />
      <CitronelleMapSection {...citronelle} />
    </>
  );
}
