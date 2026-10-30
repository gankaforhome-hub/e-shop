import { type SVGProps } from 'react';

import { LOGO_SYMBOL_IDS } from '@/shared/config/logo-symbols';

/** Draws the logo wordmark from `LogoSprite` (rendered once in the root layout). */
export function LogoTextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1320 110" {...props}>
      <use href={`#${LOGO_SYMBOL_IDS.text}`} />
    </svg>
  );
}
