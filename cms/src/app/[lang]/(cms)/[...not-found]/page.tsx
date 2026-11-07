import { notFound } from 'next/navigation';

// Unknown paths block on the server for a real 404 instead of an instant shell
export const instant = false;

/** Unknown paths render the localized not-found page inside the CMS shell. */
export default function NotFoundCatchAllPage() {
  notFound();
}
