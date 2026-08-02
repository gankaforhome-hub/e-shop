// widgets/about/about.types.ts
import type AboutDictionary from '@/dictionaries/en/about.json';
import type { Media } from '@/shared/types/media';

export type AboutPageDict = (typeof AboutDictionary)['aboutPage'];

export type AboutHeroSectionProps = AboutPageDict['aboutHero'] & {
  panel: {
    image: Media;
    imagePosition: 'left' | 'right';
  };
};

export type ArtistGallerySectionProps = AboutPageDict['artistGallery'] & {
  images: Media[];
};

export type ArtOfLivingSectionProps = AboutPageDict['artOfLiving'] & {
  panel: {
    image: Media;
    imagePosition: 'left' | 'right';
  };
};

export type OurStorySectionProps = AboutPageDict['ourStory'];

export type CitronelleMapSectionProps = AboutPageDict['citronelle'] & {
  coordinates: { lat: number; lng: number };
};
