'use client';

import { useSyncExternalStore } from 'react';

/**
 * Cookie consent, kept in the visitor's browser (it applies to anonymous visitors too).
 * Strictly necessary cookies (session, cart, favorites, language) need no consent and are
 * always on. Analytics and marketing scripts must check `hasConsent` before they load.
 * Bump CONSENT_VERSION when the categories change: an older choice is asked again.
 */
export const CONSENT_COOKIE = 'cookie_consent';
const CONSENT_VERSION = 1;
const MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
const CHANGE_EVENT = 'cookie-consent:change';
const OPEN_EVENT = 'cookie-consent:open';

export type ConsentCategory = 'analytics' | 'marketing';
export type CookieConsent = Record<ConsentCategory, boolean>;

type StoredConsent = CookieConsent & { v: number; at: string };

function readCookie(): string | undefined {
  return document.cookie
    .split('; ')
    .find(item => item.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1);
}

/** The saved choice, or null when the visitor has not chosen yet (or chose an older version). */
export function readConsent(): CookieConsent | null {
  try {
    const raw = readCookie();
    if (!raw) {
      return null;
    }
    const value: unknown = JSON.parse(decodeURIComponent(raw));
    if (
      !value ||
      typeof value !== 'object' ||
      (value as StoredConsent).v !== CONSENT_VERSION
    ) {
      return null;
    }
    const { analytics, marketing } = value as StoredConsent;
    return { analytics: analytics === true, marketing: marketing === true };
  } catch {
    return null;
  }
}

export function saveConsent(consent: CookieConsent): void {
  const stored: StoredConsent = {
    ...consent,
    v: CONSENT_VERSION,
    at: new Date().toISOString(),
  };
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    JSON.stringify(stored),
  )}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function hasConsent(category: ConsentCategory): boolean {
  return readConsent()?.[category] ?? false;
}

/** Opens the settings panel (footer "Cookie settings"). */
export function openConsentSettings(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function subscribeToConsentSettings(onOpen: () => void): () => void {
  window.addEventListener(OPEN_EVENT, onOpen);
  return () => window.removeEventListener(OPEN_EVENT, onOpen);
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

// Stable snapshot: useSyncExternalStore compares by identity
let cachedRaw: string | undefined;
let cachedConsent: CookieConsent | null = null;
function getSnapshot(): CookieConsent | null {
  const raw = readCookie();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedConsent = readConsent();
  }
  return cachedConsent;
}

/** `undefined` on the server and before hydration (nothing renders), then the choice or null. */
export function useConsent(): CookieConsent | null | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, () => undefined);
}
