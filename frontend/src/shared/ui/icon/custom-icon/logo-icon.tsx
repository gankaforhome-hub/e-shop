import { type SVGProps } from 'react';

import { LOGO_SPRITE_URL, LOGO_SYMBOL_IDS } from '@/shared/config/logo-symbols';

/** Draws the logo mark from the static logo sprite (`LOGO_SPRITE_URL`). */
export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" {...props}>
      <use href={`${LOGO_SPRITE_URL}#${LOGO_SYMBOL_IDS.mark}`} />
    </svg>
  );
}
