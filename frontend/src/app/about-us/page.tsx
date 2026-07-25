import type { Metadata } from 'next';

import { aboutUsContent } from '@/shared/content/about-us';
import {
  AboutHeroSection,
  ArtOfLivingSection,
  CitronelleMapSection,
  GankaGallerySection,
  OurStorySection,
} from '@/widgets/sections/about-us';

const {
  aboutHero,
  artOfLivingSection,
  artistGallery,

  ourStorySection,
  citronelleSection,
} = aboutUsContent;

export const metadata: Metadata = {
  title: 'About Us | Ganka For Home',
  description: aboutHero.description,
};

export default function AboutUsPage() {
  return (
    <>
      <AboutHeroSection {...aboutHero} />
      <GankaGallerySection {...artistGallery} />
      <ArtOfLivingSection {...artOfLivingSection} />
      <OurStorySection {...ourStorySection} />
      //TODO: add map
      <CitronelleMapSection {...citronelleSection} />
    </>
  );
}
