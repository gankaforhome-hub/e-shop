import { SetMetadata } from '@nestjs/common';
import { AuthAudience } from '@common/constants';

export const AUDIENCES_KEY = 'audiences';

//COMMENT decorator: which sessions a route accepts; without it, storefront sessions only
export const Audiences = (...audiences: AuthAudience[]) =>
  SetMetadata(AUDIENCES_KEY, audiences);

export const AnyAudience = () =>
  Audiences(AuthAudience.STOREFRONT, AuthAudience.CMS);
