import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { getInfoDownload } from '../../api/get-info-download';
import { INFO_DOWNLOADS, type InfoDownloadId } from '../../config/info-pages';

interface DownloadCalloutProps {
  downloadId: InfoDownloadId;
  lang: Locale;
  className?: string;
}

/** Callout with a direct download link to a locale-specific static document. */
export async function DownloadCallout({
  downloadId,
  lang,
  className,
}: DownloadCalloutProps) {
  const [{ common }, download] = await Promise.all([
    getDictionary(['common'], lang),
    getInfoDownload(downloadId, lang),
  ]);
  const copy = common.infoSection[INFO_DOWNLOADS[downloadId].dictionaryKey];
  const fileMeta = [download.format, download.size].filter(Boolean).join(' · ');

  return (
    <aside
      aria-labelledby={`download-${downloadId}`}
      className={cn(
        'border-border bg-muted/40 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:p-6',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="bg-background text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg">
          <Icon name="file-text" className="size-5" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <Heading
            id={`download-${downloadId}`}
            headingLevel="h2"
            variant="minor"
          >
            {copy.title}
          </Heading>
          <Text variant="muted" size="document" font="secondary">
            {copy.description}
          </Text>
        </div>
      </div>

      <Button asChild size="medium" className="shrink-0 gap-2">
        {/* Raw <a>: static asset — AppLink would locale-prefix the URL and `download` needs a plain href */}
        <a href={download.href} download={download.fileName}>
          <Icon name="download" className="size-4" aria-hidden />
          <span>{copy.cta}</span>
          <span className="opacity-80">({fileMeta})</span>
        </a>
      </Button>
    </aside>
  );
}
