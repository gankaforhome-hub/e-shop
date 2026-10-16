import { type Locale, locales } from '@/shared/i18n/routing';

import {
  type AttributeTranslation,
  type AttributeValueTranslation,
} from '../model/attribute-translations';
import {
  type EnumAttributeFilterKey,
  type ProductAttributeFilterKey,
  type ProductAttributeOption,
  type ProductFeatureFlag,
  type VariantAttributeKey,
} from '../model/attributes';

/* ------------------------------------------------------------------ */
/* Authoring source: typed per locale, so a new attribute key or enum  */
/* value without a translation fails `check-types`. Exported as flat   */
/* rows that mirror the future DB tables.                              */
/* ------------------------------------------------------------------ */

type AttributeNameKey =
  ProductAttributeFilterKey | VariantAttributeKey | ProductFeatureFlag;

type AttributeValueLabels = {
  [K in EnumAttributeFilterKey]: Record<ProductAttributeOption<K>, string>;
};

const ATTRIBUTE_NAMES = {
  uk: {
    material: 'Матеріал',
    colorDecoration: 'Колір',
    plateType1: 'Тип',
    plateType2: 'Призначення',
    shape: 'Форма',
    diameterCm: 'Діаметр',
    volumeMl: 'Об’єм',
    cupType: 'Тип',
    servesCount: 'Персон',
    burnTimeHours: 'Горіння',
    scent: 'Аромат',
    waxType: 'Тип воску',
    vesselMaterial: 'Ємність',
    setType: 'Тип',
    setContents: 'Склад',
    heightCm: 'Висота',
    piecesCount: 'Предметів',
    isDishwasherSafe: 'Для посудомийки',
    isMicrowaveSafe: 'Для мікрохвильовки',
    hasSaucer: 'З блюдцем',
  },
  en: {
    material: 'Material',
    colorDecoration: 'Colour',
    plateType1: 'Type',
    plateType2: 'Purpose',
    shape: 'Shape',
    diameterCm: 'Diameter',
    volumeMl: 'Volume',
    cupType: 'Type',
    servesCount: 'Serves',
    burnTimeHours: 'Burn time',
    scent: 'Scent',
    waxType: 'Wax type',
    vesselMaterial: 'Vessel',
    setType: 'Type',
    setContents: 'Contents',
    heightCm: 'Height',
    piecesCount: 'Pieces',
    isDishwasherSafe: 'Dishwasher safe',
    isMicrowaveSafe: 'Microwave safe',
    hasSaucer: 'With saucer',
  },
} satisfies Record<Locale, Record<AttributeNameKey, string>>;

const ATTRIBUTE_VALUE_LABELS = {
  uk: {
    material: {
      porcelain: 'Порцеляна',
      ceramic: 'Кераміка',
      glass: 'Скло',
      soy_wax: 'Соєвий віск',
    },
    colorDecoration: {
      coloured: 'Кольорові',
      hand_painted: 'Ручний розпис',
      gold_platinum_trim: 'Золотий чи платиновий кант',
      white: 'Білі',
    },
    plateType1: {
      flat: 'Плоска',
      rimmed: 'З бортиком',
    },
    plateType2: {
      bread: 'Хлібна',
      dessert: 'Десертна',
      dinner: 'Обідня',
      soup: 'Супова',
      serving: 'Сервірувальна',
    },
    shape: {
      round: 'Кругла',
      oval: 'Овальна',
      conical: 'Конічна',
      cylindrical: 'Циліндрична',
    },
    cupType: {
      teacup: 'Чайна',
      coffee: 'Кавова',
      espresso: 'Для еспресо',
    },
    scent: {
      unscented: 'Без аромату',
      scented: 'Ароматизована',
    },
    waxType: {
      soy: 'Соєвий',
    },
    vesselMaterial: {
      porcelain: 'Порцеляна',
      ceramic: 'Кераміка',
      glass: 'Скло',
    },
    setType: {
      tea: 'Чайний',
      coffee: 'Кавовий',
      dinner: 'Обідній',
      combination: 'Змішаний',
    },
    setContents: {
      cups: 'Чашки',
      saucers: 'Блюдця',
      plates: 'Тарілки',
      teapot: 'Чайник',
      jug: 'Глечик',
    },
  },
  en: {
    material: {
      porcelain: 'Porcelain',
      ceramic: 'Ceramic',
      glass: 'Glass',
      soy_wax: 'Soy wax',
    },
    colorDecoration: {
      coloured: 'Coloured',
      hand_painted: 'Hand-painted',
      gold_platinum_trim: 'Gold or platinum trim',
      white: 'White',
    },
    plateType1: {
      flat: 'Flat',
      rimmed: 'Rimmed',
    },
    plateType2: {
      bread: 'Bread',
      dessert: 'Dessert',
      dinner: 'Dinner',
      soup: 'Soup',
      serving: 'Serving',
    },
    shape: {
      round: 'Round',
      oval: 'Oval',
      conical: 'Conical',
      cylindrical: 'Cylindrical',
    },
    cupType: {
      teacup: 'Teacup',
      coffee: 'Coffee',
      espresso: 'Espresso',
    },
    scent: {
      unscented: 'Unscented',
      scented: 'Scented',
    },
    waxType: {
      soy: 'Soy',
    },
    vesselMaterial: {
      porcelain: 'Porcelain',
      ceramic: 'Ceramic',
      glass: 'Glass',
    },
    setType: {
      tea: 'Tea',
      coffee: 'Coffee',
      dinner: 'Dinner',
      combination: 'Mixed',
    },
    setContents: {
      cups: 'Cups',
      saucers: 'Saucers',
      plates: 'Plates',
      teapot: 'Teapot',
      jug: 'Jug',
    },
  },
} satisfies Record<Locale, AttributeValueLabels>;

export const MOCK_ATTRIBUTE_TRANSLATIONS: AttributeTranslation[] =
  locales.flatMap(languageCode =>
    Object.entries(ATTRIBUTE_NAMES[languageCode]).map(
      ([attributeKey, name]) => ({
        attributeKey,
        languageCode,
        name,
      }),
    ),
  );

export const MOCK_ATTRIBUTE_VALUE_TRANSLATIONS: AttributeValueTranslation[] =
  locales.flatMap(languageCode =>
    Object.entries(ATTRIBUTE_VALUE_LABELS[languageCode]).flatMap(
      ([attributeKey, labels]: [string, Record<string, string>]) =>
        Object.entries(labels).map(([valueKey, label]) => ({
          attributeKey,
          valueKey,
          languageCode,
          label,
        })),
    ),
  );
