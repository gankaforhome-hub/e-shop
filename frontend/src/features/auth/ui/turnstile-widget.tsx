'use client';

import { useRef } from 'react';

import Script from 'next/script';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

// The script's own global; only the call used here is typed
type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: { sitekey: string; callback: (token: string) => void },
  ) => string;
};

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
}

/** Cloudflare bot check; renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. */
export function TurnstileWidget({ onToken }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  if (!SITE_KEY) {
    return null;
  }

  const renderWidget = () => {
    const turnstile = (window as Window & { turnstile?: TurnstileApi })
      .turnstile;
    if (!turnstile || !containerRef.current || widgetIdRef.current) {
      return;
    }
    widgetIdRef.current = turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      callback: onToken,
    });
  };

  return (
    <>
      <Script src={SCRIPT_URL} strategy="lazyOnload" onReady={renderWidget} />
      <div ref={containerRef} className="min-h-16.25" />
    </>
  );
}
