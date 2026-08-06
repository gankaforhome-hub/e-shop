import { setRequestLocale } from 'next-intl/server';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { mapImagePosition } from '@/shared/lib/mapper';
import {
  AboutHeroSection,
  ArtOfLivingSection,
  CitronelleMapSection,
  GankaGallerySection,
  OurStorySection,
} from '@/widgets/sections/about-us';

// export const metadata: Metadata = {
//   title: 'About Us | Ganka For Home',
//   description: aboutHero.description,
// };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);

  const { about } = await getDictionary(['about']);
  const { aboutHero, artOfLiving, artistGallery, citronelle, ourStory } = about;

  return (
    <>
      <AboutHeroSection {...mapImagePosition(aboutHero)} />
      <GankaGallerySection {...artistGallery} />
      <ArtOfLivingSection {...mapImagePosition(artOfLiving)} />
      <OurStorySection {...ourStory} />
      {/* //TODO: add map */}
      <CitronelleMapSection {...citronelle} />
    </>
  );
}
