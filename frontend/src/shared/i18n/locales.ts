export const locales = ['en', 'ua'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ua';

export function removeLocale(path: string): string {
  const [, firstSegment, ...rest] = path.split('/');

  if (locales.includes(firstSegment as Locale)) {
    return `/${rest.join('/')}`;
  }

  return path;
}

// якщо локалі приходять динамічно (кращий варіант), можна перевіряти формат:
// function removeLocale(path: string): string {
//   const segments = path.split('/').filter(Boolean);

//   if (segments.length && /^[a-z]{2}(-[A-Z]{2})?$/.test(segments[0])) {
//     return `/${segments.slice(1).join('/')}`;
//   }

//   return path;
// }
