import { parsePhoneNumberFromString } from 'libphonenumber-js';

/** E-mails never contain whitespace; autofill and paste often add some. */
export const stripWhitespace = (value: string) => value.replace(/\s+/g, '');

// The phone input emits digits without the leading `+`
const parsePhone = (value: string) =>
  parsePhoneNumberFromString(value.startsWith('+') ? value : `+${value}`);

export const isValidPhone = (value: string) =>
  parsePhone(value)?.isValid() ?? false;

/** `380441234567` → `+380441234567`; unparsable values pass through. */
export const toE164 = (value: string) => parsePhone(value)?.number ?? value;
