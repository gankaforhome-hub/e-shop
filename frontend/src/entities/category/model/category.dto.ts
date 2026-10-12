import { type Category } from './types';

/** Category resolved for one locale. */
export type CategoryDTO = Category & {
  title: string;
  description: string;
};
