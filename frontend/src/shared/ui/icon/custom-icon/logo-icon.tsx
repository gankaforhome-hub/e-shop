import { type SVGProps } from 'react';

import { LOGO_SYMBOL_IDS } from '@/shared/config/logo-symbols';

/** Draws the logo mark from `LogoSprite` (rendered once in the root layout). */
export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" {...props}>
      <use href={`#${LOGO_SYMBOL_IDS.mark}`} />
    </svg>
  );
}
