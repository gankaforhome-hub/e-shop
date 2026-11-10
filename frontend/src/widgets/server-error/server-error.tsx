'use client';

import { AppMedia } from '@/shared/ui/app-media';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

/** Strings of `common.serverError` (the global error page reads the JSON directly). */
export interface ServerErrorTexts {
  imageSrc: string;
  imageAlt: string;
  textError: string;
  pageTitle: string;
  description: string;
  retryLabel: string;
  buttonText: string;
  buttonAriaLabel: string;
}

interface ServerErrorWidgetProps {
  texts: ServerErrorTexts;
  /** Locale-aware home path. A plain anchor, so the home page loads from scratch. */
  homeHref: string;
  /** The boundary's `retry`: re-fetches and re-renders the failed segment. */
  onRetry: () => void;
}

/**
 * Error page shown when rendering fails, typically because the backend API is
 * unreachable. Same layout as `NotFoundWidget`, with the "503" snail (the HTTP
 * status is still 500; both read as a temporary failure). Free of next-intl
 * and routing context so it also works inside `global-error`.
 */
export function ServerErrorWidget({
  texts,
  homeHref,
  onRetry,
}: ServerErrorWidgetProps) {
  return (
    <Section className="fpy-6/30">
      <Container className="max-xl:fgap-8/16 flex flex-col items-center justify-center lg:flex-row-reverse lg:justify-between">
        <AppMedia
          src={texts.imageSrc}
          alt={texts.imageAlt}
          width={827}
          height={620}
          placeholder="empty"
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="h-auto w-full max-w-7xl"
        />
        <div className="max-w-lg">
          <Text className="ftext-3/4 fleading-8/9 fmb-2/4 uppercase tracking-wider">
            {texts.textError}
          </Text>
          <Heading
            headingLevel="h1"
            className="ftext-6/8 fleading-8/9 fmb-2/4 tracking-tight"
          >
            {texts.pageTitle}
          </Heading>
          <Text as="h2" size="none" className="ftext-4/6 fleading-6/8 fmb-8/16">
            {texts.description}
          </Text>
          {/* The outage is temporary, so retrying is the main action */}
          <div className="flex flex-wrap gap-4">
            <Button type="button" onClick={onRetry}>
              {texts.retryLabel}
            </Button>
            <Button asChild variant="outline">
              <a href={homeHref} aria-label={texts.buttonAriaLabel}>
                {texts.buttonText}
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
