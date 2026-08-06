import { type Collection } from '../model/types';

export const getCollections = async (): Promise<Collection[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    {
      id: 'col-1',
      slug: 'agro',
      title: 'Agro',
      shortDescription:
        'The collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury.',
      description: `The collection symbolizes the connection between the past and the present. It pays homage to history, combining the traditions of high culture with an innovative vision of the modern world. A rare flower that blooms for only a moment, it embodies beauty and sophistication that require special attention and respect.\n\nThe collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury. The central image is a majestic rabbit in a crown, sitting among the blossoms of the “queen of the night” cactus - symbol of inimitable French elegance and mystery.\n\nIts artistic excellence will add sophistication to every feast, and the atmosphere of unique style will emphasize the exclusivity of moments spent at the table in the circle of the most dear ones.`,
      media: {
        src: '/images/collections/agro-collection.png',
        alt: 'Agro Collection',
      },
      categoryIds: ['cat-1', 'cat-3', 'cat-5'],
      productIds: ['prod-1', 'prod-3', 'prod-7', 'prod-12', 'prod-19'],
      seo: {
        title: "Collection of tableware | Author's ceramics",
        description: 'Buy ceramic dishes: plates, cups, teapots.',
      },
    },
    {
      id: 'col-2',
      slug: 'easter',
      title: 'Easter',
      shortDescription:
        'The collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury.',
      description: `The collection symbolizes the connection between the past and the present. It pays homage to history, combining the traditions of high culture with an innovative vision of the modern world. A rare flower that blooms for only a moment, it embodies beauty and sophistication that require special attention and respect.\n\nThe collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury. The central image is a majestic rabbit in a crown, sitting among the blossoms of the “queen of the night” cactus - symbol of inimitable French elegance and mystery.\n\nIts artistic excellence will add sophistication to every feast, and the atmosphere of unique style will emphasize the exclusivity of moments spent at the table in the circle of the most dear ones.`,
      media: {
        src: '/images/collections/easter_2025.png',
        alt: 'Easter Collection',
      },
      categoryIds: ['cat-2', 'cat-4', 'cat-6'],
      productIds: ['prod-2', 'prod-5', 'prod-9', 'prod-14', 'prod-20'],
      seo: {
        title: "Collection of tableware | Author's ceramics",
        description: 'Buy ceramic dishes: plates, cups, teapots.',
      },
    },
    {
      id: 'col-3',
      slug: 'ptahy',
      title: 'Ptahy',
      shortDescription:
        'The collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury.',
      description: `The collection symbolizes the connection between the past and the present.\n\nIt pays homage to history, combining high culture with modern vision.`,
      media: {
        src: '/images/collections/ptahy.png',
        alt: 'Ptahy Collection',
      },
      categoryIds: ['cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5', 'cat-6'],
      productIds: [
        'prod-4',
        'prod-8',
        'prod-11',
        'prod-16',
        'prod-22',
        'prod-24',
      ],
      seo: {
        title: "Collection of tableware | Author's ceramics",
        description: 'Buy ceramic dishes: plates, cups, teapots.',
      },
    },
    {
      id: 'col-4',
      slug: 'botanica',
      title: 'Botanica',
      shortDescription:
        'Inspired by wild garden flora and natural elegance, this collection brings warm, earthy tones to your dining room.',
      description: `Inspired by wild garden flora and natural elegance.\n\nHandcrafted ceramic pieces celebrating subtle organic shapes.`,
      media: {
        src: '/images/collections/agro-collection.png',
        alt: 'Botanica Collection',
      },
      categoryIds: ['cat-1', 'cat-5'],
      productIds: ['prod-2', 'prod-6', 'prod-10', 'prod-13', 'prod-18'],
      seo: {
        title: 'Botanica Ceramic Collection | Tableware',
        description: 'Explore handmade ceramic tableware inspired by nature.',
      },
    },
    {
      id: 'col-5',
      slug: 'heritage',
      title: 'Heritage',
      shortDescription:
        'A tribute to timeless craftsman techniques blended with contemporary minimalist aesthetics.',
      description: `A tribute to timeless craftsman techniques blended with contemporary minimalist aesthetics.\n\nDesigned for family gatherings and modern classic interiors.`,
      media: {
        src: '/images/collections/easter_2025.png',
        alt: 'Heritage Collection',
      },
      categoryIds: ['cat-3', 'cat-4', 'cat-6'],
      productIds: [
        'prod-1',
        'prod-5',
        'prod-12',
        'prod-15',
        'prod-21',
        'prod-23',
      ],
      seo: {
        title: 'Heritage Ceramic Set | Author Tableware',
        description: 'Traditional ceramic craftsmanship for modern homes.',
      },
    },
    {
      id: 'col-6',
      slug: 'solaris',
      title: 'Solaris',
      shortDescription:
        'Bright, warm tones reflecting golden hour sunlight for festive table settings.',
      description: `Bright, warm tones reflecting golden hour sunlight.\n\nBrings warmth and joy to every morning tea or coffee ritual.`,

      media: {
        src: '/images/collections/ptahy.png',
        alt: 'Solaris',
      },
      categoryIds: ['cat-2', 'cat-3', 'cat-5'],
      productIds: ['prod-3', 'prod-7', 'prod-8', 'prod-17', 'prod-19'],
      seo: {
        title: 'Solaris Ceramic Collection | Sunny Tableware',
        description: 'Warm, sun-inspired ceramic plates and cups.',
      },
    },
    {
      id: 'col-7',
      slug: 'aura',
      title: 'Aura',
      shortDescription:
        'Subtle pastel glazes and gentle curves crafted for refined, calm dining spaces.',
      description: `Subtle pastel glazes and gentle curves crafted for refined, calm dining spaces.\n\nSmooth textures that delight the senses during every meal.`,
      media: {
        src: '/images/collections/agro-collection.png',
        alt: 'Aura Collection',
      },
      categoryIds: ['cat-1', 'cat-4', 'cat-6'],
      productIds: ['prod-4', 'prod-9', 'prod-11', 'prod-14', 'prod-24'],
      seo: {
        title: 'Aura Collection | Pastel Ceramics',
        description: 'Elegant pastel ceramic tableware for a calm atmosphere.',
      },
    },
    {
      id: 'col-8',
      slug: 'terra',
      title: 'Terra',
      shortDescription:
        'Raw textures and clay tones that emphasize raw natural beauty and grounded elegance.',
      description: `Raw textures and clay tones that emphasize natural beauty.\n\nPerfect balance between rugged touch and refined finishing.`,
      media: {
        src: '/images/collections/easter_2025.png',
        alt: 'Terra Collection',
      },
      categoryIds: ['cat-2', 'cat-5', 'cat-6'],
      productIds: [
        'prod-6',
        'prod-10',
        'prod-15',
        'prod-18',
        'prod-20',
        'prod-22',
      ],
      seo: {
        title: 'Terra Ceramic Collection | Earthy Ceramics',
        description: 'Authentic clay ceramic dishes with natural texture.',
      },
    },
    {
      id: 'col-9',
      slug: 'lumiere',
      title: 'Lumiere',
      shortDescription:
        'Light-reflecting glossy finishes that bring sophistication to evening celebrations.',
      description: `Light-reflecting glossy finishes that bring sophistication.\n\nDesigned to turn dinner into a special occasion.`,
      media: {
        src: '/images/collections/ptahy.png',
        alt: 'Lumiere Collection',
      },
      categoryIds: ['cat-1', 'cat-2', 'cat-3'],
      productIds: ['prod-1', 'prod-8', 'prod-13', 'prod-16', 'prod-23'],
      seo: {
        title: 'Lumiere Collection | Glossy Tableware',
        description: 'Sophisticated ceramic sets for evening celebrations.',
      },
    },
    {
      id: 'col-10',
      slug: 'vintage-bloom',
      title: 'Vintage Bloom',
      shortDescription:
        'Classic floral motifs reimagined through a contemporary artistic lens.',
      description: `Classic floral motifs reimagined through a contemporary artistic lens.\n\nDelicate art details that charm guests and collector enthusiasts.`,

      media: {
        src: '/images/collections/agro-collection.png',
        alt: 'Vintage Bloom Collection',
      },
      categoryIds: ['cat-3', 'cat-4', 'cat-5'],
      productIds: ['prod-3', 'prod-5', 'prod-12', 'prod-17', 'prod-21'],
      seo: {
        title: 'Vintage Bloom Collection | Floral Ceramics',
        description: 'Artistic ceramic tableware with romantic floral details.',
      },
    },
    {
      id: 'col-11',
      slug: 'nordic-mist',
      title: 'Nordic Mist',
      shortDescription:
        'Cool grey tones and clean geometric lines for Scandinavian-inspired interiors.',
      description: `Cool grey tones and clean geometric lines.\n\nScandi-style ceramic tableware designed for functional beauty.`,
      media: {
        src: '/images/collections/easter_2025.png',
        alt: 'Nordic Mist Collection',
      },
      categoryIds: ['cat-1', 'cat-6'],
      productIds: ['prod-2', 'prod-7', 'prod-9', 'prod-19', 'prod-24'],
      seo: {
        title: 'Nordic Mist | Scandi Ceramic Tableware',
        description:
          'Minimalist grey ceramic dishes for Scandinavian aesthetic.',
      },
    },
    {
      id: 'col-12',
      slug: 'royal-garden',
      title: 'Royal Garden',
      shortDescription:
        'Exquisite table accents designed for memorable dining experiences.',
      description: `Exquisite table accents designed for memorable dining experiences.\n\nRich artistic accents that highlight every culinary presentation.`,

      media: {
        src: '/images/collections/ptahy.png',
        alt: 'Royal Garden Collection',
      },
      categoryIds: ['cat-2', 'cat-4', 'cat-5', 'cat-6'],
      productIds: [
        'prod-4',
        'prod-6',
        'prod-10',
        'prod-14',
        'prod-18',
        'prod-22',
      ],
      seo: {
        title: 'Royal Garden | Premium Ceramic Collection',
        description: 'Luxury ceramics designed for high-end table settings.',
      },
    },
  ];
};
