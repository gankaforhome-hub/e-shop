import { getDictionary } from '@/shared/i18n';
import { mapImagePosition } from '@/shared/lib/mapper';
import {
  AboutHeroSection,
  type AboutPageDict,
  ArtOfLivingSection,
  CitronelleMapSection,
  GankaGallerySection,
  OurStorySection,
} from '@/widgets/sections/about-us';

// export const metadata: Metadata = {
//   title: 'About Us | Ganka For Home',
//   description: aboutHero.description,
// };

export default async function AboutUsPage() {
  // const { locale } = await params;
  // const dict = await getDictionary<'about'>(locale, ['about']);

  const dict = await getDictionary<'about'>('ua', ['about']);
  const {
    aboutPage: { aboutHero, artOfLiving, artistGallery, ourStory, citronelle },
  } = dict as unknown as { aboutPage: AboutPageDict };

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
