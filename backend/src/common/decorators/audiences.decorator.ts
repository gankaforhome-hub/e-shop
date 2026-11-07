import { SetMetadata } from '@nestjs/common';
import { E_AuthAudience } from '@prisma/client';

export const AUDIENCES_KEY = 'audiences';

//COMMENT decorator: which sessions a route accepts; without it, storefront sessions only
export const Audiences = (...audiences: E_AuthAudience[]) =>
  SetMetadata(AUDIENCES_KEY, audiences);

export const AnyAudience = () =>
  Audiences(E_AuthAudience.STOREFRONT, E_AuthAudience.CMS);
