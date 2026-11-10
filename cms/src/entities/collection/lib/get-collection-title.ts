import { type AdminCollection } from '../model/types';

/** The uk title (always present by the API contract), else the slug. */
export const getCollectionTitle = ({ translations, slug }: AdminCollection) =>
  translations.find(item => item.languageCode === 'uk')?.title ?? slug;
