'use client';

import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

/** Strings of `common.serverError` (the global error page reads the JSON directly). */
export interface ServerErrorTexts {
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
  onRetry: () => void;
}

/**
 * "500" page shown when rendering fails, typically because the backend API is
 * unreachable. Same layout as `NotFoundWidget`, with a big numeral instead of
 * the snail picture (that one has "404" drawn into it). Free of next-intl and
 * routing context so it also works inside `global-error`.
 */
export function ServerErrorWidget({
  texts,
  homeHref,
  onRetry,
}: ServerErrorWidgetProps) {
  return (
    <Section className="fpy-6/30">
      <Container className="max-xl:fgap-8/16 flex flex-col items-center justify-center lg:flex-row-reverse lg:justify-between">
        <Text
          as="div"
          size="none"
          aria-hidden="true"
          className="ftext-44/96 fleading-44/96 text-foreground/10 font-display flex w-full max-w-7xl select-none justify-center lg:basis-2/3"
        >
          500
        </Text>
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
