import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @returns  merge string style tailwind and object style (as clsx)
 */
export function mergeStyleTailwindAndObjectStyle(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
