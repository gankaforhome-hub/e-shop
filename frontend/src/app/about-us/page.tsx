import type { Metadata } from 'next';

import {
  AboutHeroSection,
  aboutUsContent,
  ArtOfLivingSection,
  CitronelleMapSection,
  GankaGallery,
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
      <GankaGallery {...artistGallery} />
      <ArtOfLivingSection {...artOfLivingSection} />
      <OurStorySection {...ourStorySection} />
      //TODO: add map
      <CitronelleMapSection {...citronelleSection} />
    </>
  );
}
