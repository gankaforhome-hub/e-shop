import { type InfoSlug } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { Heading } from '@/shared/ui/heading';

import { getInfoDocument } from '../../api/get-info-document';
import {
  getInfoDownloads,
  isMarkdownInfoSlug,
  type MarkdownInfoSlug,
} from '../../config/info-pages';
import { DownloadCallout } from '../download-callout/download-callout';
import { MarkdownContent } from '../markdown-content/markdown-content';
import { FaqContentSection } from '../pages';

interface InfoContentProps {
  infoSlug: InfoSlug;
  lang: Locale;
}

/** Renders an info page body according to its `INFO_PAGES` source. */
export async function InfoContent({ infoSlug, lang }: InfoContentProps) {
  if (isMarkdownInfoSlug(infoSlug)) {
    return <MarkdownArticle infoSlug={infoSlug} lang={lang} />;
  }
  return <FaqContentSection lang={lang} />;
}

async function MarkdownArticle({
  infoSlug,
  lang,
}: {
  infoSlug: MarkdownInfoSlug;
  lang: Locale;
}) {
  const { title, body } = await getInfoDocument(infoSlug, lang);

  return (
    <article className="fgap-5/8 flex flex-col">
      <Heading headingLevel="h1" variant="document">
        {title}
      </Heading>
      <MarkdownContent>{body}</MarkdownContent>
      {getInfoDownloads(infoSlug).map(downloadId => (
        <DownloadCallout
          key={downloadId}
          downloadId={downloadId}
          lang={lang}
          className="mt-3 md:mt-5"
        />
      ))}
    </article>
  );
}

export function InfoContentSkeleton() {
  return (
    <div className="fgap-5/8 flex animate-pulse flex-col" aria-hidden>
      <div className="bg-muted h-8 w-2/3 md:h-9" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="bg-muted h-3.5 w-full last:w-4/5 md:h-4"
          />
        ))}
      </div>
    </div>
  );
}
