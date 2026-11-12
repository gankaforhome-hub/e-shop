import { useSyncExternalStore } from 'react';

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

/**
 * Token of an email link. The link keeps it in the fragment, which the server never
 * receives. `null` until hydration, empty when the link has no token.
 */
export function useLinkToken(): string | null {
  return useSyncExternalStore(
    subscribeToHash,
    () => new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '',
    () => null,
  );
}
