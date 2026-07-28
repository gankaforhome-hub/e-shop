import { type Media } from '@/shared/types';

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface ImageTextPanelContent {
  image: Media;
  paragraphs: string;
  imagePosition: 'left' | 'right';
}
export interface SectionIntroContent {
  heading: string;
  description: string;
}

export interface AboutHeroContent extends SectionIntroContent {
  panel: ImageTextPanelContent;
}

export interface GallerySectionContent extends SectionIntroContent {
  images: ImageAsset[];
}

export interface ImageTextSectionContent extends SectionIntroContent {
  panel: ImageTextPanelContent;
}

export interface StorySectionContent extends SectionIntroContent {
  image: ImageAsset;
}

export interface MapSectionContent extends SectionIntroContent {
  mapImage: ImageAsset;
  mapEmbedUrl?: string;
}

const aboutHero: AboutHeroContent = {
  heading: 'Ganka for Home: A Touch of Sophistication to Your Interior',
  description:
    'Ganka Tretyak is a name that embodies the essence of creativity. As a true artist, she transforms her multifaceted career as an artist, filmmaker, author, and organizer of cultural events into the magical world of porcelain.',
  panel: {
    image: {
      src: '/images/about/artist-intro-birds-berries.webp',
      alt: 'Hand-painted plate depicting two birds among red rosehip berries',
    },
    imagePosition: 'left',
    paragraphs: `Ganka Tretyak is a name that embodies the essence of creativity. As a true artist, she transforms her multifaceted career as an artist, filmmaker, author, and organizer of cultural events into the magical world of porcelain. Ganka doesn't just create, she reflects on all her experience, embodying in each product her unique perspective on life.\n\n
      Ganka doesn't just create, she reflects on all her experience, embodying in each product her unique perspective on life. Each element reflects Ganka's love for detail, her ability to transform everyday things into something special.\n\n
      Her works are an exquisite balance between form and color, embodying joy, tenderness, and kindness.`,
  },
};

const artistGallery: GallerySectionContent = {
  heading: 'Artist Ganka: Creativity in a Unique Form.',
  description:
    'Ganka knows how to add color to life like no one else. Her porcelain products are filled with lightness and playfulness, reflecting her ability to capture beauty in the simplest things. Each product is not only a piece of her artistic soul, but also an invitation to a world where creativity becomes part of everyday life.',
  images: [
    {
      src: '/images/about/gallery-rabbit.webp',
      alt: 'Plate illustrated with a rabbit and butterflies',
    },
    {
      src: '/images/about/gallery-berries-1.webp',
      alt: 'Plate illustrated with a bird among red berries',
    },
    {
      src: '/images/about/gallery-berries-2.webp',
      alt: 'Plate illustrated with red berries on branches',
    },
    {
      src: '/images/about/gallery-silver.webp',
      alt: 'Plate with a textured silver-grey glazed rim',
    },
  ],
};

const artOfLivingSection: ImageTextSectionContent = {
  heading: 'The Art of Living in Your Home',
  description:
    "Each element reflects Ganka's love for detail, her ability to transform everyday things into something special. Her works are an exquisite balance between form and color, embodying joy, tenderness, and kindness.",
  panel: {
    image: {
      src: '/images/about/art-of-living-dragon.webp',
      alt: 'Plate illustrated with a green dragon and a woman in a flowing gown',
    },
    imagePosition: 'left',
    paragraphs: `Ganka knows how to add color to life like no one else. Her porcelain products are filled with lightness and playfulness, reflecting her ability to capture beauty in the simplest things. Each product is not only a piece of her artistic soul, but also an invitation to a world where creativity becomes part of everyday life.\n\nAs a film director, author and a participant in many art and music projects, Ganka knows perfectly well what an intense pace of living means. The artist offers to get daily inspiration from art and bright colors. Ganka for Home collections will bring a festive atmosphere and warmth to your home.\n\nIts artistic excellence will add sophistication to every feast, and the atmosphere of unique style will emphasize the exclusivity of moments spent at the table in the circle of the most dear ones.`,
  },
};

const ourStorySection: StorySectionContent = {
  heading: 'Our Story',
  description:
    'Ganka for Home collections combine the images of Ukrainian culture and fairytale motifs that will add a jolly mood to your home. The bright elements of the illustrations are designed to create a festive atmosphere as Ganka for Home tableware can be used on a daily basis.',
  image: {
    src: '/images/about/our-story-collage.webp',
    alt: 'Collage of illustrated plates featuring pumpkin, eggplant, pepper, and redcurrant motifs with two children',
  },
};

const citronelleSection: MapSectionContent = {
  heading: 'Collection Citronelle at restaurants',
  description:
    'The Citronelle collection can be purchased at Citronelle restaurants at the appropriate addresses.',
  mapImage: {
    src: '/images/about/citronelle-map-kyiv.webp',
    alt: 'Map of Kyiv showing Citronelle restaurant locations',
  },
  // Optional: swap in a live embed instead of the static image above.
  // mapEmbedUrl: "https://www.google.com/maps/embed?pb=...",
};

export const aboutUsContent = {
  aboutHero,
  artistGallery,
  artOfLivingSection,
  ourStorySection,
  citronelleSection,
};
