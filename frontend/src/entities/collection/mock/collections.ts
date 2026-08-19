import {
  type Collection,
  type CollectionCategory,
  type CollectionSeo,
  type CollectionTranslation,
} from '../model/types';

export const mockCollections: Collection[] = [
  {
    id: 'col-1',
    slug: 'agro',
    media: {
      src: '/images/collections/agro-collection.png',
      alt: 'Agro Collection',
    },
  },
  {
    id: 'col-2',
    slug: 'easter',
    media: {
      src: '/images/collections/easter_2025.png',
      alt: 'Easter Collection',
    },
  },
  {
    id: 'col-3',
    slug: 'ptahy',
    media: { src: '/images/collections/ptahy.png', alt: 'Ptahy Collection' },
  },
  {
    id: 'col-4',
    slug: 'botanica',
    media: {
      src: '/images/collections/agro-collection.png',
      alt: 'Botanica Collection',
    },
  },
  {
    id: 'col-5',
    slug: 'heritage',
    media: {
      src: '/images/collections/easter_2025.png',
      alt: 'Heritage Collection',
    },
  },
  {
    id: 'col-6',
    slug: 'solaris',
    media: { src: '/images/collections/ptahy.png', alt: 'Solaris' },
  },
  {
    id: 'col-7',
    slug: 'aura',
    media: {
      src: '/images/collections/agro-collection.png',
      alt: 'Aura Collection',
    },
  },
  {
    id: 'col-8',
    slug: 'terra',
    media: {
      src: '/images/collections/easter_2025.png',
      alt: 'Terra Collection',
    },
  },
  {
    id: 'col-9',
    slug: 'lumiere',
    media: { src: '/images/collections/ptahy.png', alt: 'Lumiere Collection' },
  },
  {
    id: 'col-10',
    slug: 'vintage-bloom',
    media: {
      src: '/images/collections/agro-collection.png',
      alt: 'Vintage Bloom Collection',
    },
  },
  {
    id: 'col-11',
    slug: 'nordic-mist',
    media: {
      src: '/images/collections/easter_2025.png',
      alt: 'Nordic Mist Collection',
    },
  },
  {
    id: 'col-12',
    slug: 'royal-garden',
    media: {
      src: '/images/collections/ptahy.png',
      alt: 'Royal Garden Collection',
    },
  },
];

export const mockCollectionCategories: CollectionCategory[] = [
  // Agro
  { collectionId: 'col-1', categoryId: 'cat-1' },
  { collectionId: 'col-1', categoryId: 'cat-3' },
  { collectionId: 'col-1', categoryId: 'cat-5' },
  // Easter
  { collectionId: 'col-2', categoryId: 'cat-2' },
  { collectionId: 'col-2', categoryId: 'cat-4' },
  { collectionId: 'col-2', categoryId: 'cat-6' },
  // Ptahy
  { collectionId: 'col-3', categoryId: 'cat-1' },
  { collectionId: 'col-3', categoryId: 'cat-2' },
  { collectionId: 'col-3', categoryId: 'cat-3' },
  { collectionId: 'col-3', categoryId: 'cat-4' },
  { collectionId: 'col-3', categoryId: 'cat-5' },
  { collectionId: 'col-3', categoryId: 'cat-6' },
  // Botanica
  { collectionId: 'col-4', categoryId: 'cat-1' },
  { collectionId: 'col-4', categoryId: 'cat-5' },
  // Heritage
  { collectionId: 'col-5', categoryId: 'cat-3' },
  { collectionId: 'col-5', categoryId: 'cat-4' },
  { collectionId: 'col-5', categoryId: 'cat-6' },
  // Solaris
  { collectionId: 'col-6', categoryId: 'cat-2' },
  { collectionId: 'col-6', categoryId: 'cat-3' },
  { collectionId: 'col-6', categoryId: 'cat-5' },
  // Aura
  { collectionId: 'col-7', categoryId: 'cat-1' },
  { collectionId: 'col-7', categoryId: 'cat-4' },
  { collectionId: 'col-7', categoryId: 'cat-6' },
  // Terra
  { collectionId: 'col-8', categoryId: 'cat-2' },
  { collectionId: 'col-8', categoryId: 'cat-5' },
  { collectionId: 'col-8', categoryId: 'cat-6' },
  // Lumiere
  { collectionId: 'col-9', categoryId: 'cat-1' },
  { collectionId: 'col-9', categoryId: 'cat-2' },
  { collectionId: 'col-9', categoryId: 'cat-3' },
  // Vintage Bloom
  { collectionId: 'col-10', categoryId: 'cat-3' },
  { collectionId: 'col-10', categoryId: 'cat-4' },
  { collectionId: 'col-10', categoryId: 'cat-5' },
  // Nordic Mist
  { collectionId: 'col-11', categoryId: 'cat-1' },
  { collectionId: 'col-11', categoryId: 'cat-6' },
  // Royal Garden
  { collectionId: 'col-12', categoryId: 'cat-2' },
  { collectionId: 'col-12', categoryId: 'cat-4' },
  { collectionId: 'col-12', categoryId: 'cat-5' },
  { collectionId: 'col-12', categoryId: 'cat-6' },
];

export const mockCollectionTranslations: CollectionTranslation[] = [
  {
    collectionId: 'col-1',
    languageCode: 'en',
    title: 'Agro',
    shortDescription:
      'The collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury.',
    description: `The collection symbolizes the connection between the past and the present. It pays homage to history, combining the traditions of high culture with an innovative vision of the modern world. A rare flower that blooms for only a moment, it embodies beauty and sophistication that require special attention and respect.\n\nThe collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury. The central image is a majestic rabbit in a crown, sitting among the blossoms of the “queen of the night” cactus - symbol of inimitable French elegance and mystery.\n\nIts artistic excellence will add sophistication to every feast, and the atmosphere of unique style will emphasize the exclusivity of moments spent at the table in the circle of the most dear ones.`,
  },
  {
    collectionId: 'col-2',
    languageCode: 'en',
    title: 'Easter',
    shortDescription:
      'The collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury.',
    description: `The collection symbolizes the connection between the past and the present. It pays homage to history, combining the traditions of high culture with an innovative vision of the modern world. A rare flower that blooms for only a moment, it embodies beauty and sophistication that require special attention and respect.\n\nThe collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury. The central image is a majestic rabbit in a crown, sitting among the blossoms of the “queen of the night” cactus - symbol of inimitable French elegance and mystery.\n\nIts artistic excellence will add sophistication to every feast, and the atmosphere of unique style will emphasize the exclusivity of moments spent at the table in the circle of the most dear ones.`,
  },
  {
    collectionId: 'col-3',
    languageCode: 'en',
    title: 'Ptahy',
    shortDescription:
      'The collection, created in collaboration with French restaurant Citronelle, transports us to a world of aristocratic luxury.',
    description: `The collection symbolizes the connection between the past and the present.\n\nIt pays homage to history, combining high culture with modern vision.`,
  },
  {
    collectionId: 'col-4',
    languageCode: 'en',
    title: 'Botanica',
    shortDescription:
      'Inspired by wild garden flora and natural elegance, this collection brings warm, earthy tones to your dining room.',
    description: `Inspired by wild garden flora and natural elegance.\n\nHandcrafted ceramic pieces celebrating subtle organic shapes.`,
  },
  {
    collectionId: 'col-5',
    languageCode: 'en',
    title: 'Heritage',
    shortDescription:
      'A tribute to timeless craftsman techniques blended with contemporary minimalist aesthetics.',
    description: `A tribute to timeless craftsman techniques blended with contemporary minimalist aesthetics.\n\nDesigned for family gatherings and modern classic interiors.`,
  },
  {
    collectionId: 'col-6',
    languageCode: 'en',
    title: 'Solaris',
    shortDescription:
      'Bright, warm tones reflecting golden hour sunlight for festive table settings.',
    description: `Bright, warm tones reflecting golden hour sunlight.\n\nBrings warmth and joy to every morning tea or coffee ritual.`,
  },
  {
    collectionId: 'col-7',
    languageCode: 'en',
    title: 'Aura',
    shortDescription:
      'Subtle pastel glazes and gentle curves crafted for refined, calm dining spaces.',
    description: `Subtle pastel glazes and gentle curves crafted for refined, calm dining spaces.\n\nSmooth textures that delight the senses during every meal.`,
  },
  {
    collectionId: 'col-8',
    languageCode: 'en',
    title: 'Terra',
    shortDescription:
      'Raw textures and clay tones that emphasize raw natural beauty and grounded elegance.',
    description: `Raw textures and clay tones that emphasize natural beauty.\n\nPerfect balance between rugged touch and refined finishing.`,
  },
  {
    collectionId: 'col-9',
    languageCode: 'en',
    title: 'Lumiere',
    shortDescription:
      'Light-reflecting glossy finishes that bring sophistication to evening celebrations.',
    description: `Light-reflecting glossy finishes that bring sophistication.\n\nDesigned to turn dinner into a special occasion.`,
  },
  {
    collectionId: 'col-10',
    languageCode: 'en',
    title: 'Vintage Bloom',
    shortDescription:
      'Classic floral motifs reimagined through a contemporary artistic lens.',
    description: `Classic floral motifs reimagined through a contemporary artistic lens.\n\nDelicate art details that charm guests and collector enthusiasts.`,
  },
  {
    collectionId: 'col-11',
    languageCode: 'en',
    title: 'Nordic Mist',
    shortDescription:
      'Cool grey tones and clean geometric lines for Scandinavian-inspired interiors.',
    description: `Cool grey tones and clean geometric lines.\n\nScandi-style ceramic tableware designed for functional beauty.`,
  },
  {
    collectionId: 'col-12',
    languageCode: 'en',
    title: 'Royal Garden',
    shortDescription:
      'Exquisite table accents designed for memorable dining experiences.',
    description: `Exquisite table accents designed for memorable dining experiences.\n\nRich artistic accents that highlight every culinary presentation.`,
  },
  {
    collectionId: 'col-1',
    languageCode: 'uk',
    title: 'Agro',
    shortDescription:
      'Колекція, створена у співпраці з французьким рестораном Citronelle, переносить нас у світ аристократичної розкоші.',
    description: `Колекція символізує зв’язок між минулим і сучасністю. Вона віддає данину історії, поєднуючи традиції високої культури з інноваційним баченням сучасного світу. Рідкісна квітка, що розквітає лише на мить, вона втілює красу та витонченість, які потребують особливої уваги й поваги.\n\nКолекція, створена у співпраці з французьким рестораном Citronelle, переносить нас у світ аристократичної розкоші. Центральний образ — величний кролик у короні, що сидить серед квітів кактуса «цариця ночі» — символу неповторної французької елегантності та загадковості.\n\nЇї художня досконалість додасть витонченості кожному застіллю, а атмосфера унікального стилю підкреслить винятковість моментів, проведених за столом у колі найдорожчих людей.`,
  },
  {
    collectionId: 'col-2',
    languageCode: 'uk',
    title: 'Великдень',
    shortDescription:
      'Колекція, створена у співпраці з французьким рестораном Citronelle, переносить нас у світ аристократичної розкоші.',
    description: `Колекція символізує зв’язок між минулим і сучасністю. Вона віддає данину історії, поєднуючи традиції високої культури з інноваційним баченням сучасного світу. Рідкісна квітка, що розквітає лише на мить, вона втілює красу та витонченість, які потребують особливої уваги й поваги.\n\nКолекція, створена у співпраці з французьким рестораном Citronelle, переносить нас у світ аристократичної розкоші. Центральний образ — величний кролик у короні, що сидить серед квітів кактуса «цариця ночі» — символу неповторної французької елегантності та загадковості.\n\nЇї художня досконалість додасть витонченості кожному застіллю, а атмосфера унікального стилю підкреслить винятковість моментів, проведених за столом у колі найдорожчих людей.`,
  },
  {
    collectionId: 'col-3',
    languageCode: 'uk',
    title: 'Птахи',
    shortDescription:
      'Колекція, створена у співпраці з французьким рестораном Citronelle, переносить нас у світ аристократичної розкоші.',
    description: `Колекція символізує зв’язок між минулим і сучасністю.\n\nВона віддає данину історії, поєднуючи високу культуру із сучасним баченням.`,
  },
  {
    collectionId: 'col-4',
    languageCode: 'uk',
    title: 'Ботаніка',
    shortDescription:
      'Натхненна дикою садовою флорою та природною елегантністю, ця колекція наповнює ваш обідній простір теплими, землистими відтінками.',
    description: `Натхнена дикою садовою флорою та природною елегантністю.\n\nВироби ручної роботи з кераміки, що оспівують делікатні органічні форми.`,
  },
  {
    collectionId: 'col-5',
    languageCode: 'uk',
    title: 'Спадщина',
    shortDescription:
      'Данина вічним ремісничим технікам, поєднаним із сучасною мінімалістичною естетикою.',
    description: `Данина вічним ремісничим технікам, поєднаним із сучасною мінімалістичною естетикою.\n\nСтворена для сімейних зустрічей і сучасних інтер’єрів у стилі сучасної класики.`,
  },
  {
    collectionId: 'col-6',
    languageCode: 'uk',
    title: 'Соляріс',
    shortDescription:
      'Яскраві теплі відтінки, що відображають золоте світло сонця та створюють святкову атмосферу за столом.',
    description: `Яскраві теплі відтінки, натхненні золотим світлом сонця.\n\nДарує тепло й радість кожному ранковому чаюванню чи кавовому ритуалу.`,
  },
  {
    collectionId: 'col-7',
    languageCode: 'uk',
    title: 'Аура',
    shortDescription:
      'Ніжні пастельні глазурі та плавні вигини, створені для витончених і спокійних обідніх просторів.',
    description: `Ніжні пастельні глазурі та плавні вигини, створені для витончених і спокійних обідніх просторів.\n\nГладкі текстури, що дарують насолоду під час кожної трапези.`,
  },
  {
    collectionId: 'col-8',
    languageCode: 'uk',
    title: 'Терра',
    shortDescription:
      'Фактурні поверхні та глиняні відтінки, що підкреслюють природну красу й стриману елегантність.',
    description: `Фактурні поверхні та глиняні відтінки, що підкреслюють природну красу.\n\nІдеальний баланс між природною фактурністю та витонченим оздобленням.`,
  },
  {
    collectionId: 'col-9',
    languageCode: 'uk',
    title: 'Люм’єр',
    shortDescription:
      'Глянцеві поверхні, що відбивають світло та додають витонченості вечірнім святкуванням.',
    description: `Глянцеві поверхні, що відбивають світло та додають витонченості.\n\nСтворена, щоб перетворити вечерю на особливу подію.`,
  },
  {
    collectionId: 'col-10',
    languageCode: 'uk',
    title: 'Вінтажне цвітіння',
    shortDescription:
      'Класичні квіткові мотиви, переосмислені крізь призму сучасного мистецтва.',
    description: `Класичні квіткові мотиви, переосмислені крізь призму сучасного мистецтва.\n\nВишукані художні деталі, що зачаровують гостей і поціновувачів колекційних виробів.`,
  },
  {
    collectionId: 'col-11',
    languageCode: 'uk',
    title: 'Північний туман',
    shortDescription:
      'Прохолодні сірі відтінки та чіткі геометричні лінії для інтер’єрів у скандинавському стилі.',
    description: `Прохолодні сірі відтінки та чіткі геометричні лінії.\n\nКерамічний посуд у скандинавському стилі, створений для поєднання функціональності та краси.`,
  },
  {
    collectionId: 'col-12',
    languageCode: 'uk',
    title: 'Королівський сад',
    shortDescription:
      'Вишукані акценти для столу, створені для незабутніх гастрономічних вражень.',
    description: `Вишукані акценти для столу, створені для незабутніх гастрономічних вражень.\n\nНасичені художні деталі, що підкреслюють красу кожної кулінарної подачі.`,
  },
];

export const mockCollectionSeo: CollectionSeo[] = [
  {
    collectionId: 'col-1',
    languageCode: 'en',
    title: "Collection of tableware | Author's ceramics",
    description: 'Buy ceramic dishes: plates, cups, teapots.',
  },
  {
    collectionId: 'col-2',
    languageCode: 'en',
    title: "Collection of tableware | Author's ceramics",
    description: 'Buy ceramic dishes: plates, cups, teapots.',
  },
  {
    collectionId: 'col-3',
    languageCode: 'en',
    title: "Collection of tableware | Author's ceramics",
    description: 'Buy ceramic dishes: plates, cups, teapots.',
  },
  {
    collectionId: 'col-4',
    languageCode: 'en',
    title: 'Botanica Ceramic Collection | Tableware',
    description: 'Explore handmade ceramic tableware inspired by nature.',
  },
  {
    collectionId: 'col-5',
    languageCode: 'en',
    title: 'Heritage Ceramic Set | Author Tableware',
    description: 'Traditional ceramic craftsmanship for modern homes.',
  },
  {
    collectionId: 'col-6',
    languageCode: 'en',
    title: 'Solaris Ceramic Collection | Sunny Tableware',
    description: 'Warm, sun-inspired ceramic plates and cups.',
  },
  {
    collectionId: 'col-7',
    languageCode: 'en',
    title: 'Aura Collection | Pastel Ceramics',
    description: 'Elegant pastel ceramic tableware for a calm atmosphere.',
  },
  {
    collectionId: 'col-8',
    languageCode: 'en',
    title: 'Terra Ceramic Collection | Earthy Ceramics',
    description: 'Authentic clay ceramic dishes with natural texture.',
  },
  {
    collectionId: 'col-9',
    languageCode: 'en',
    title: 'Lumiere Collection | Glossy Tableware',
    description: 'Sophisticated ceramic sets for evening celebrations.',
  },
  {
    collectionId: 'col-10',
    languageCode: 'en',
    title: 'Vintage Bloom Collection | Floral Ceramics',
    description: 'Artistic ceramic tableware with romantic floral details.',
  },
  {
    collectionId: 'col-11',
    languageCode: 'en',
    title: 'Nordic Mist | Scandi Ceramic Tableware',
    description: 'Minimalist grey ceramic dishes for Scandinavian aesthetic.',
  },
  {
    collectionId: 'col-12',
    languageCode: 'en',
    title: 'Royal Garden | Premium Ceramic Collection',
    description: 'Luxury ceramics designed for high-end table settings.',
  },

  {
    collectionId: 'col-1',
    languageCode: 'uk',
    title: 'Колекція столового посуду | Авторська кераміка',
    description: 'Купити керамічний посуд: тарілки, чашки, чайники.',
  },
  {
    collectionId: 'col-2',
    languageCode: 'uk',
    title: 'Колекція столового посуду | Авторська кераміка',
    description: 'Купити керамічний посуд: тарілки, чашки, чайники.',
  },
  {
    collectionId: 'col-3',
    languageCode: 'uk',
    title: 'Колекція столового посуду | Авторська кераміка',
    description: 'Купити керамічний посуд: тарілки, чашки, чайники.',
  },
  {
    collectionId: 'col-4',
    languageCode: 'uk',
    title: 'Керамічна колекція Botanica | Столовий посуд',
    description:
      'Відкрийте для себе колекцію керамічного посуду ручної роботи, натхненну природою.',
  },
  {
    collectionId: 'col-5',
    languageCode: 'uk',
    title: 'Керамічна колекція Heritage | Авторський посуд',
    description: 'Традиційна керамічна майстерність для сучасного дому.',
  },
  {
    collectionId: 'col-6',
    languageCode: 'uk',
    title: 'Керамічна колекція Solaris | Сонячний посуд',
    description:
      'Теплі керамічні тарілки та чашки, натхненні сонячним світлом.',
  },
  {
    collectionId: 'col-7',
    languageCode: 'uk',
    title: 'Колекція Aura | Пастельна кераміка',
    description:
      'Вишуканий пастельний керамічний посуд для створення спокійної атмосфери.',
  },
  {
    collectionId: 'col-8',
    languageCode: 'uk',
    title: 'Керамічна колекція Terra | Природні відтінки',
    description:
      'Автентичний керамічний посуд із натуральної глини з природною текстурою.',
  },
  {
    collectionId: 'col-9',
    languageCode: 'uk',
    title: 'Колекція Lumiere | Глянцевий посуд',
    description: 'Вишукані керамічні набори для вечірніх святкувань.',
  },
  {
    collectionId: 'col-10',
    languageCode: 'uk',
    title: 'Колекція Vintage Bloom | Квіткова кераміка',
    description:
      'Авторський керамічний посуд із романтичними квітковими деталями.',
  },
  {
    collectionId: 'col-11',
    languageCode: 'uk',
    title: 'Nordic Mist | Скандинавський керамічний посуд',
    description:
      'Мінімалістичний сірий керамічний посуд у скандинавській естетиці.',
  },
  {
    collectionId: 'col-12',
    languageCode: 'uk',
    title: 'Royal Garden | Преміальна керамічна колекція',
    description: 'Розкішний керамічний посуд для вишуканої сервіровки столу.',
  },
];
