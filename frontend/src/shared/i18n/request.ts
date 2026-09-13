// import { getRequestConfig } from 'next-intl/server';

// import { getDictionary } from './get-dictionary';
// import { isValidLocale } from './helpers';
// import { defaultLocale } from './routing';

// export default getRequestConfig(async ({ requestLocale }) => {
//   let locale = await requestLocale;

//   if (!isValidLocale(locale)) {
//     locale = defaultLocale;
//   }

//   return {
//     locale,
//     messages: await getDictionary([], locale),
//   };
// });

import type { AbstractIntlMessages } from 'next-intl';

import { getRequestConfig } from 'next-intl/server';

import { getDictionary } from './get-dictionary';
import { isValidLocale } from './helpers';
import { defaultLocale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!isValidLocale(locale)) {
    locale = defaultLocale;
  }

  const messages = await getDictionary([], locale);

  return {
    locale,
    messages: messages as unknown as AbstractIntlMessages,
  };
});
