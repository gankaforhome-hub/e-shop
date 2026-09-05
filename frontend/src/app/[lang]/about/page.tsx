import { type Metadata } from 'next';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { getMetadata, type IGetMetadataProps } from '@/shared/i18n/get-metada';
import { buildMetadata } from '@/shared/i18n/helpers/build-metadata';
import { parseAboutDictionary } from '@/shared/i18n/schemas/about.schema';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import {
  AboutHeroSection,
  ArtOfLivingSection,
  CitronelleMapSection,
  GankaGallerySection,
  OurStorySection,
} from '@/widgets/sections/about-us';

interface IAboutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: IGetMetadataProps): Promise<Metadata> {
  const { lang } = await params;

  const meta = await getMetadata('about', lang);

  return buildMetadata({
    meta,
    lang,
    path: '/about',
  });
}

export default async function AboutPage({ params }: IAboutPageProps) {
  const { lang } = await params;
  const { about } = await getDictionary(['about'], lang);
  const { aboutHero, artistGallery, artOfLiving, ourStory, citronelle } =
    parseAboutDictionary(about);

  return (
    <>
      <Breadcrumbs />
      <AboutHeroSection {...aboutHero} />
      <GankaGallerySection {...artistGallery} />
      <ArtOfLivingSection {...artOfLiving} />
      <OurStorySection {...ourStory} />
      <CitronelleMapSection
        {...citronelle}
        mapEmbedUrl="https://maps.google.com/maps?q=Citronelle,%2050.446057,30.5115394&t=&z=12&ie=UTF8&iwloc=&output=embed"
      />
    </>
  );
}
