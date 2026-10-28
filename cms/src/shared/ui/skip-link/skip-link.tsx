import { type HashHref } from '@/shared/config';

import { AppLink } from '../app-link';

/** First tab stop: jumps keyboard users past the navigation. */
export function SkipLink({ href, label }: { href: HashHref; label: string }) {
  return (
    <AppLink
      href={href}
      className="sr-only z-50 rounded-md bg-background px-3 py-2 text-sm font-medium text-foreground-emphasis shadow-md focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      {label}
    </AppLink>
  );
}
