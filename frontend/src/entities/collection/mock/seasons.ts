import { type Season, type SeasonTranslation } from '../model/season';

export const mockSeasons: Season[] = [
  { slug: 'spring', sortOrder: 1 },
  { slug: 'easter', sortOrder: 2 },
  { slug: 'summer', sortOrder: 3 },
  { slug: 'autumn', sortOrder: 4 },
  { slug: 'winter', sortOrder: 5 },
  { slug: 'christmas', sortOrder: 6 },
  { slug: 'new_year', sortOrder: 7 },
];

export const mockSeasonTranslations: SeasonTranslation[] = [
  { seasonSlug: 'spring', languageCode: 'uk', label: 'Весна' },
  { seasonSlug: 'spring', languageCode: 'en', label: 'Spring' },
  { seasonSlug: 'easter', languageCode: 'uk', label: 'Великдень' },
  { seasonSlug: 'easter', languageCode: 'en', label: 'Easter' },
  { seasonSlug: 'summer', languageCode: 'uk', label: 'Літо' },
  { seasonSlug: 'summer', languageCode: 'en', label: 'Summer' },
  { seasonSlug: 'autumn', languageCode: 'uk', label: 'Осінь' },
  { seasonSlug: 'autumn', languageCode: 'en', label: 'Autumn' },
  { seasonSlug: 'winter', languageCode: 'uk', label: 'Зима' },
  { seasonSlug: 'winter', languageCode: 'en', label: 'Winter' },
  { seasonSlug: 'christmas', languageCode: 'uk', label: 'Різдво' },
  { seasonSlug: 'christmas', languageCode: 'en', label: 'Christmas' },
  { seasonSlug: 'new_year', languageCode: 'uk', label: 'Новий рік' },
  { seasonSlug: 'new_year', languageCode: 'en', label: 'New Year' },
];
