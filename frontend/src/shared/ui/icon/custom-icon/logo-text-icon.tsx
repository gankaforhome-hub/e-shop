import { type SVGProps } from 'react';

import { LOGO_SPRITE_URL, LOGO_SYMBOL_IDS } from '@/shared/config/logo-symbols';

/** Draws the logo wordmark from the static logo sprite (`LOGO_SPRITE_URL`). */
export function LogoTextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1320 110" {...props}>
      <use href={`${LOGO_SPRITE_URL}#${LOGO_SYMBOL_IDS.text}`} />
    </svg>
  );
}
