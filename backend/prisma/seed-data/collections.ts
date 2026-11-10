import { type E_Locale } from '@prisma/client';

// Demo seasons and collections, moved here from the former storefront mocks (the storefront now
// reads them from the API). Mock ids (col-*) are dropped: rows are matched by slug. Collection ↔
// category links wait for the category module. The mocks had no skuPrefix.

export interface ISeedSeason {
  slug: string;
  sortOrder: number;
  labels: Record<E_Locale, string>;
}

export interface ISeedCollectionTranslation {
  title: string;
  shortDescription: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}

export interface ISeedCollection {
  slug: string;
  seasonSlug: string | null;
  // Relative to frontend/public. Several collections share a file, so one Media row each;
  // the mock alts ("Agro Collection") are left out: the API falls back to the localized title
  coverImage: string;
  translations: Record<E_Locale, ISeedCollectionTranslation>;
}

export const SEED_SEASONS: ISeedSeason[] = [
  { slug: 'spring', sortOrder: 1, labels: { uk: 'Весна', en: 'Spring' } },
  { slug: 'easter', sortOrder: 2, labels: { uk: 'Великдень', en: 'Easter' } },
  { slug: 'summer', sortOrder: 3, labels: { uk: 'Літо', en: 'Summer' } },
  { slug: 'autumn', sortOrder: 4, labels: { uk: 'Осінь', en: 'Autumn' } },
  { slug: 'winter', sortOrder: 5, labels: { uk: 'Зима', en: 'Winter' } },
  {
    slug: 'christmas',
    sortOrder: 6,
    labels: { uk: 'Різдво', en: 'Christmas' },
  },
  {
    slug: 'new_year',
    sortOrder: 7,
    labels: { uk: 'Новий рік', en: 'New Year' },
  },
];

const AGRO_DESCRIPTION_EN = `The collection symbolizes the connection between the past and the present. It pays homage to history, combining the traditions of high culture with an innovative vision of the modern world. A rare flower that blooms for only a moment, it embodies beauty and sophistication that require special attention and respect.\n\nThe collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury. The central image is a majestic rabbit in a crown, sitting among the blossoms of the “queen of the night” cactus - symbol of inimitable French elegance and mystery.\n\nIts artistic excellence will add sophistication to every feast, and the atmosphere of unique style will emphasize the exclusivity of moments spent at the table in the circle of the most dear ones.`;
const AGRO_DESCRIPTION_UK = `Колекція символізує зв’язок між минулим і сучасністю. Вона віддає данину історії, поєднуючи традиції високої культури з інноваційним баченням сучасного світу. Рідкісна квітка, що розквітає лише на мить, вона втілює красу та витонченість, які потребують особливої уваги й поваги.\n\nКолекція, створена у співпраці з французьким рестораном Citronelle, переносить нас у світ аристократичної розкоші. Центральний образ — величний кролик у короні, що сидить серед квітів кактуса «цариця ночі» — символу неповторної французької елегантності та загадковості.\n\nЇї художня досконалість додасть витонченості кожному застіллю, а атмосфера унікального стилю підкреслить винятковість моментів, проведених за столом у колі найдорожчих людей.`;
const CITRONELLE_SHORT_EN =
  'The collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury.';
const CITRONELLE_SHORT_UK =
  'Колекція, створена у співпраці з французьким рестораном Citronelle, переносить нас у світ аристократичної розкоші.';
const GENERIC_META_EN = {
  metaTitle: "Collection of tableware | Author's ceramics",
  metaDescription: 'Buy ceramic dishes: plates, cups, teapots.',
};
const GENERIC_META_UK = {
  metaTitle: 'Колекція столового посуду | Авторська кераміка',
  metaDescription: 'Купити керамічний посуд: тарілки, чашки, чайники.',
};

// Mock order; sortOrder is the 1-based position
export const SEED_COLLECTIONS: ISeedCollection[] = [
  {
    slug: 'agro',
    seasonSlug: 'autumn',
    coverImage: 'images/collections/agro-collection.png',
    translations: {
      en: {
        title: 'Agro',
        shortDescription: CITRONELLE_SHORT_EN,
        description: AGRO_DESCRIPTION_EN,
        ...GENERIC_META_EN,
      },
      uk: {
        title: 'Agro',
        shortDescription: CITRONELLE_SHORT_UK,
        description: AGRO_DESCRIPTION_UK,
        ...GENERIC_META_UK,
      },
    },
  },
  {
    slug: 'easter',
    seasonSlug: 'easter',
    coverImage: 'images/collections/easter_2025.png',
    translations: {
      en: {
        title: 'Easter',
        shortDescription: CITRONELLE_SHORT_EN,
        description: AGRO_DESCRIPTION_EN,
        ...GENERIC_META_EN,
      },
      uk: {
        title: 'Великдень',
        shortDescription: CITRONELLE_SHORT_UK,
        description: AGRO_DESCRIPTION_UK,
        ...GENERIC_META_UK,
      },
    },
  },
  {
    slug: 'ptahy',
    seasonSlug: 'easter',
    coverImage: 'images/collections/ptahy.png',
    translations: {
      en: {
        title: 'Ptahy',
        shortDescription: CITRONELLE_SHORT_EN,
        description: `The collection symbolizes the connection between the past and the present.\n\nIt pays homage to history, combining high culture with modern vision.`,
        ...GENERIC_META_EN,
      },
      uk: {
        title: 'Птахи',
        shortDescription: CITRONELLE_SHORT_UK,
        description: `Колекція символізує зв’язок між минулим і сучасністю.\n\nВона віддає данину історії, поєднуючи високу культуру із сучасним баченням.`,
        ...GENERIC_META_UK,
      },
    },
  },
  {
    slug: 'botanica',
    seasonSlug: 'christmas',
    coverImage: 'images/collections/agro-collection.png',
    translations: {
      en: {
        title: 'Botanica',
        shortDescription:
          'Inspired by wild garden flora and natural elegance, this collection brings warm, earthy tones to your dining room.',
        description: `Inspired by wild garden flora and natural elegance.\n\nHandcrafted ceramic pieces celebrating subtle organic shapes.`,
        metaTitle: 'Botanica Ceramic Collection | Tableware',
        metaDescription:
          'Explore handmade ceramic tableware inspired by nature.',
      },
      uk: {
        title: 'Ботаніка',
        shortDescription:
          'Натхненна дикою садовою флорою та природною елегантністю, ця колекція наповнює ваш обідній простір теплими, землистими відтінками.',
        description: `Натхнена дикою садовою флорою та природною елегантністю.\n\nВироби ручної роботи з кераміки, що оспівують делікатні органічні форми.`,
        metaTitle: 'Керамічна колекція Botanica | Столовий посуд',
        metaDescription:
          'Відкрийте для себе колекцію керамічного посуду ручної роботи, натхненну природою.',
      },
    },
  },
  {
    slug: 'heritage',
    seasonSlug: null,
    coverImage: 'images/collections/easter_2025.png',
    translations: {
      en: {
        title: 'Heritage',
        shortDescription:
          'A tribute to timeless craftsman techniques blended with contemporary minimalist aesthetics.',
        description: `A tribute to timeless craftsman techniques blended with contemporary minimalist aesthetics.\n\nDesigned for family gatherings and modern classic interiors.`,
        metaTitle: 'Heritage Ceramic Set | Author Tableware',
        metaDescription: 'Traditional ceramic craftsmanship for modern homes.',
      },
      uk: {
        title: 'Спадщина',
        shortDescription:
          'Данина вічним ремісничим технікам, поєднаним із сучасною мінімалістичною естетикою.',
        description: `Данина вічним ремісничим технікам, поєднаним із сучасною мінімалістичною естетикою.\n\nСтворена для сімейних зустрічей і сучасних інтер’єрів у стилі сучасної класики.`,
        metaTitle: 'Керамічна колекція Heritage | Авторський посуд',
        metaDescription:
          'Традиційна керамічна майстерність для сучасного дому.',
      },
    },
  },
  {
    slug: 'solaris',
    seasonSlug: 'new_year',
    coverImage: 'images/collections/ptahy.png',
    translations: {
      en: {
        title: 'Solaris',
        shortDescription:
          'Bright, warm tones reflecting golden hour sunlight for festive table settings.',
        description: `Bright, warm tones reflecting golden hour sunlight.\n\nBrings warmth and joy to every morning tea or coffee ritual.`,
        metaTitle: 'Solaris Ceramic Collection | Sunny Tableware',
        metaDescription: 'Warm, sun-inspired ceramic plates and cups.',
      },
      uk: {
        title: 'Соляріс',
        shortDescription:
          'Яскраві теплі відтінки, що відображають золоте світло сонця та створюють святкову атмосферу за столом.',
        description: `Яскраві теплі відтінки, натхненні золотим світлом сонця.\n\nДарує тепло й радість кожному ранковому чаюванню чи кавовому ритуалу.`,
        metaTitle: 'Керамічна колекція Solaris | Сонячний посуд',
        metaDescription:
          'Теплі керамічні тарілки та чашки, натхненні сонячним світлом.',
      },
    },
  },
  {
    slug: 'aura',
    seasonSlug: null,
    coverImage: 'images/collections/agro-collection.png',
    translations: {
      en: {
        title: 'Aura',
        shortDescription:
          'Subtle pastel glazes and gentle curves crafted for refined, calm dining spaces.',
        description: `Subtle pastel glazes and gentle curves crafted for refined, calm dining spaces.\n\nSmooth textures that delight the senses during every meal.`,
        metaTitle: 'Aura Collection | Pastel Ceramics',
        metaDescription:
          'Elegant pastel ceramic tableware for a calm atmosphere.',
      },
      uk: {
        title: 'Аура',
        shortDescription:
          'Ніжні пастельні глазурі та плавні вигини, створені для витончених і спокійних обідніх просторів.',
        description: `Ніжні пастельні глазурі та плавні вигини, створені для витончених і спокійних обідніх просторів.\n\nГладкі текстури, що дарують насолоду під час кожної трапези.`,
        metaTitle: 'Колекція Aura | Пастельна кераміка',
        metaDescription:
          'Вишуканий пастельний керамічний посуд для створення спокійної атмосфери.',
      },
    },
  },
  {
    slug: 'terra',
    seasonSlug: 'winter',
    coverImage: 'images/collections/easter_2025.png',
    translations: {
      en: {
        title: 'Terra',
        shortDescription:
          'Raw textures and clay tones that emphasize raw natural beauty and grounded elegance.',
        description: `Raw textures and clay tones that emphasize natural beauty.\n\nPerfect balance between rugged touch and refined finishing.`,
        metaTitle: 'Terra Ceramic Collection | Earthy Ceramics',
        metaDescription: 'Authentic clay ceramic dishes with natural texture.',
      },
      uk: {
        title: 'Терра',
        shortDescription:
          'Фактурні поверхні та глиняні відтінки, що підкреслюють природну красу й стриману елегантність.',
        description: `Фактурні поверхні та глиняні відтінки, що підкреслюють природну красу.\n\nІдеальний баланс між природною фактурністю та витонченим оздобленням.`,
        metaTitle: 'Керамічна колекція Terra | Природні відтінки',
        metaDescription:
          'Автентичний керамічний посуд із натуральної глини з природною текстурою.',
      },
    },
  },
  {
    slug: 'lumiere',
    seasonSlug: 'christmas',
    coverImage: 'images/collections/ptahy.png',
    translations: {
      en: {
        title: 'Lumiere',
        shortDescription:
          'Light-reflecting glossy finishes that bring sophistication to evening celebrations.',
        description: `Light-reflecting glossy finishes that bring sophistication.\n\nDesigned to turn dinner into a special occasion.`,
        metaTitle: 'Lumiere Collection | Glossy Tableware',
        metaDescription: 'Sophisticated ceramic sets for evening celebrations.',
      },
      uk: {
        title: 'Люм’єр',
        shortDescription:
          'Глянцеві поверхні, що відбивають світло та додають витонченості вечірнім святкуванням.',
        description: `Глянцеві поверхні, що відбивають світло та додають витонченості.\n\nСтворена, щоб перетворити вечерю на особливу подію.`,
        metaTitle: 'Колекція Lumiere | Глянцевий посуд',
        metaDescription: 'Вишукані керамічні набори для вечірніх святкувань.',
      },
    },
  },
  {
    slug: 'vintage-bloom',
    seasonSlug: 'autumn',
    coverImage: 'images/collections/agro-collection.png',
    translations: {
      en: {
        title: 'Vintage Bloom',
        shortDescription:
          'Classic floral motifs reimagined through a contemporary artistic lens.',
        description: `Classic floral motifs reimagined through a contemporary artistic lens.\n\nDelicate art details that charm guests and collector enthusiasts.`,
        metaTitle: 'Vintage Bloom Collection | Floral Ceramics',
        metaDescription:
          'Artistic ceramic tableware with romantic floral details.',
      },
      uk: {
        title: 'Вінтажне цвітіння',
        shortDescription:
          'Класичні квіткові мотиви, переосмислені крізь призму сучасного мистецтва.',
        description: `Класичні квіткові мотиви, переосмислені крізь призму сучасного мистецтва.\n\nВишукані художні деталі, що зачаровують гостей і поціновувачів колекційних виробів.`,
        metaTitle: 'Колекція Vintage Bloom | Квіткова кераміка',
        metaDescription:
          'Авторський керамічний посуд із романтичними квітковими деталями.',
      },
    },
  },
  {
    slug: 'nordic-mist',
    seasonSlug: 'winter',
    coverImage: 'images/collections/easter_2025.png',
    translations: {
      en: {
        title: 'Nordic Mist',
        shortDescription:
          'Cool grey tones and clean geometric lines for Scandinavian-inspired interiors.',
        description: `Cool grey tones and clean geometric lines.\n\nScandi-style ceramic tableware designed for functional beauty.`,
        metaTitle: 'Nordic Mist | Scandi Ceramic Tableware',
        metaDescription:
          'Minimalist grey ceramic dishes for Scandinavian aesthetic.',
      },
      uk: {
        title: 'Північний туман',
        shortDescription:
          'Прохолодні сірі відтінки та чіткі геометричні лінії для інтер’єрів у скандинавському стилі.',
        description: `Прохолодні сірі відтінки та чіткі геометричні лінії.\n\nКерамічний посуд у скандинавському стилі, створений для поєднання функціональності та краси.`,
        metaTitle: 'Nordic Mist | Скандинавський керамічний посуд',
        metaDescription:
          'Мінімалістичний сірий керамічний посуд у скандинавській естетиці.',
      },
    },
  },
  {
    slug: 'royal-garden',
    seasonSlug: 'summer',
    coverImage: 'images/collections/ptahy.png',
    translations: {
      en: {
        title: 'Royal Garden',
        shortDescription:
          'Exquisite table accents designed for memorable dining experiences.',
        description: `Exquisite table accents designed for memorable dining experiences.\n\nRich artistic accents that highlight every culinary presentation.`,
        metaTitle: 'Royal Garden | Premium Ceramic Collection',
        metaDescription:
          'Luxury ceramics designed for high-end table settings.',
      },
      uk: {
        title: 'Королівський сад',
        shortDescription:
          'Вишукані акценти для столу, створені для незабутніх гастрономічних вражень.',
        description: `Вишукані акценти для столу, створені для незабутніх гастрономічних вражень.\n\nНасичені художні деталі, що підкреслюють красу кожної кулінарної подачі.`,
        metaTitle: 'Royal Garden | Преміальна керамічна колекція',
        metaDescription:
          'Розкішний керамічний посуд для вишуканої сервіровки столу.',
      },
    },
  },
  {
    slug: 'konyushina',
    seasonSlug: 'spring',
    coverImage: 'images/hero_image.webp',
    translations: {
      en: {
        title: 'Konyushina',
        shortDescription:
          'A new collection inspired by meadow clover — delicate botanical motifs for everyday serving.',
        description: `Konyushina (clover) celebrates the quiet beauty of Ukrainian meadows. Soft greens and hand-painted leaves bring a fresh, natural mood to the table.\n\nEach piece is made at our workshop in Ukraine and is designed for both everyday meals and festive gatherings.`,
        metaTitle: 'Konyushina Collection | Handmade Ceramic Tableware',
        metaDescription: 'Clover-inspired handmade ceramic plates and sets.',
      },
      uk: {
        title: 'Конюшина',
        shortDescription:
          'Нова колекція, натхненна лучною конюшиною, — ніжні ботанічні мотиви для щоденної сервіровки.',
        description: `Конюшина оспівує тиху красу українських луків. М’які зелені відтінки та розписане вручну листя створюють свіжий, природний настрій за столом.\n\nКожен виріб виготовлено в нашій майстерні в Україні — для щоденних трапез і святкових зустрічей.`,
        metaTitle: 'Колекція Конюшина | Керамічний посуд ручної роботи',
        metaDescription:
          'Керамічні тарілки та набори ручної роботи з мотивами конюшини.',
      },
    },
  },
  {
    slug: 'winter',
    seasonSlug: 'winter',
    coverImage: 'images/hero_image_2.webp',
    translations: {
      en: {
        title: 'Winter',
        shortDescription:
          'A popular collection for cosy winter evenings — warm tones and tea-time essentials.',
        description: `Winter gathers everything for slow, warm evenings: teapots, cups and sets in calm, frosty tones.\n\nMade by hand in Ukraine to keep the warmth of home at every tea table.`,
        metaTitle: 'Winter Collection | Ceramic Teapots & Cups',
        metaDescription:
          'Handmade ceramic teapots, cups and sets for winter evenings.',
      },
      uk: {
        title: 'Зима',
        shortDescription:
          'Популярна колекція для затишних зимових вечорів — теплі відтінки та все для чаювання.',
        description: `«Зима» об’єднує все для неспішних теплих вечорів: чайники, чашки та набори у спокійних морозних відтінках.\n\nВиготовлено вручну в Україні, щоб зберігати тепло дому за кожним чайним столом.`,
        metaTitle: 'Колекція Зима | Керамічні чайники та чашки',
        metaDescription:
          'Керамічні чайники, чашки та набори ручної роботи для зимових вечорів.',
      },
    },
  },
];
