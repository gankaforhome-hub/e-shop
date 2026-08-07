const RTL_LOCALE_REGEX = /^(ar|fa|he|iw|ur|ps|sd|ug|yi|ckb|ku|syr|dv)(-|$)/i;

export function isRTL(locale: string): boolean {
  return RTL_LOCALE_REGEX.test(locale);
}

export function getLocaleDirection(locale: string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}
