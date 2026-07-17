import type { Metadata } from 'next';

import {
  AboutGankaSection,
  AboutHeroSection,
  aboutUsContent,
  ArtOfLivingSection,
  CitronelleSection,
  GankaGallery,
  OurStorySection,
} from '@/widgets/sections/about-us';

const {
  aboutHero,
  artOfLivingSection,
  artistGallery,
  artistIntroPanel,
  ourStorySection,
  citronelleSection,
} = aboutUsContent;

export const metadata: Metadata = {
  title: 'About Us | Ganka For Home',
  description: aboutHero.paragraph,
};

export default function AboutUsPage() {
  return (
    <>
      <AboutHeroSection {...aboutHero} />
      <AboutGankaSection {...artistIntroPanel} />
      <GankaGallery {...artistGallery} />
      <ArtOfLivingSection {...artOfLivingSection} />
      <OurStorySection {...ourStorySection} />
      //TODO: add map
      <CitronelleSection {...citronelleSection} />
    </>
  );
}
